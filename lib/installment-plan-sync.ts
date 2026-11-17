import 'server-only'
import { db } from './site-data'
import { createStripeClient, stripeKey, type StripeClient } from './stripe-api'
import { ensureFixedInstallmentPlan, NeedsReview } from './installment-plan'

// ============================================================
// Called by the Stripe webhook after a paid coaching checkout. For a
// monthly installment enrollment it makes sure the Stripe subscription
// stops by itself after the last payment, and records the result on
// the enrollment so the admin shows it.
//
// Throws when the plan could not be confirmed. The webhook then answers
// 500 so Stripe retries the event, and the admin shows the plan as
// needing attention. Never reports success unless Stripe confirmed it.
// ============================================================

const AFTER_CHANGE = 'Needs review (after change): '

interface PlanEnrollment {
  id: string
  payment_option: string
  test_mode: boolean | null
  price_installment_count: number | null
  price_installment_cents: number | null
  installment_plan_status: string | null
  installment_plan_error: string | null
  stripe_subscription_id: string | null
}

export async function applyInstallmentPlan(
  enrollmentId: string,
  session: { id: string; mode: string; subscription?: string | { id: string } | null },
  client?: StripeClient,
): Promise<'not_installment' | 'already_scheduled' | 'scheduled'> {
  const { data: e, error } = await db().from('enrollments')
    .select('id, payment_option, test_mode, price_installment_count, price_installment_cents, installment_plan_status, installment_plan_error, stripe_subscription_id')
    .eq('id', enrollmentId).maybeSingle()
  if (error) throw error
  const row = e as PlanEnrollment | null
  if (!row || row.payment_option !== 'installment' || row.test_mode) return 'not_installment'

  const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id ?? null
  const payments = row.price_installment_count ?? 0
  const amountCents = row.price_installment_cents ?? 0

  const fail = async (message: string) => {
    const { error: upErr } = await db().from('enrollments').update({
      installment_plan_status: 'failed',
      installment_plan_error: message.slice(0, 500),
      installment_plan_payments: payments || null,
      installment_plan_checked_at: new Date().toISOString(),
      ...(subscriptionId ? { stripe_subscription_id: subscriptionId } : {}),
    }).eq('id', row.id)
    if (upErr) console.error('[installments] could not record the failure:', upErr)
    console.error(`[installments] enrollment ${row.id}: ${message}`)
    return new Error(message)
  }

  // Already done for this subscription: nothing to call
  if (row.installment_plan_status === 'scheduled' && row.stripe_subscription_id === subscriptionId) return 'already_scheduled'
  // A problem found after Stripe was changed stays flagged until someone checks it
  if (row.installment_plan_status === 'failed' && row.installment_plan_error?.startsWith(AFTER_CHANGE)) {
    console.error(`[installments] enrollment ${row.id} still needs review: ${row.installment_plan_error}`)
    throw new Error(row.installment_plan_error)
  }

  if (session.mode !== 'subscription' || !subscriptionId) throw await fail('Needs review: the installment checkout did not create a monthly plan in Stripe')
  if (!payments || !amountCents) throw await fail('Needs review: the enrollment has no installment count or amount')

  const key = client ? null : stripeKey()
  if (!client && !key) throw await fail('The Stripe key for installment plans (STRIPE_RESTRICTED_KEY) is not set')
  const stripe = client ?? createStripeClient(key!)

  try {
    const r = await ensureFixedInstallmentPlan(stripe, { subscriptionId, payments, amountCents, enrollmentId: row.id })
    const { error: upErr } = await db().from('enrollments').update({
      installment_plan_status: 'scheduled',
      installment_plan_error: null,
      installment_plan_payments: payments,
      installment_plan_ends_at: new Date(r.endsAt * 1000).toISOString(),
      installment_plan_checked_at: new Date().toISOString(),
      stripe_subscription_id: subscriptionId,
      stripe_schedule_id: r.scheduleId,
    }).eq('id', row.id)
    if (upErr) throw upErr
    return r.changed ? 'scheduled' : 'already_scheduled'
  } catch (err) {
    if (err instanceof NeedsReview) {
      throw await fail(err.sticky ? AFTER_CHANGE + err.message.replace(/^Needs review: /, '') : err.message)
    }
    throw await fail(`Could not set the plan end yet (will retry): ${err instanceof Error ? err.message : String(err)}`)
  }
}
