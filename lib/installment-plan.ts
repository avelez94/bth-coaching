import type { StripeClient } from './stripe-api'

// ============================================================
// Fixed length installment plans
//
// A Stripe Payment Link can only start an open ended monthly
// subscription. After a paid installment checkout, the webhook calls
// ensureFixedInstallmentPlan, which uses Stripe's supported structure
// for "end after N billing periods":
//
//   1. turn the existing subscription into a subscription schedule
//      (from_subscription, so Stripe copies the subscription's own
//      settings into the schedule's one phase)
//   2. update that schedule: keep the phase exactly as Stripe built it,
//      give it a length of N monthly billing periods from the
//      subscription's start, and set end_behavior = cancel
//   3. read the subscription back and confirm that Stripe now cancels
//      it at the end of period N, and that price, quantity, discounts,
//      tax, payment method, billing anchor, customer and metadata are
//      all unchanged
//
// Nothing is rebuilt from assumptions: every field of the phase is
// copied from what Stripe returned. A field this code does not know how
// to carry over stops the process (NeedsReview) instead of being
// dropped. Safe to run any number of times for the same subscription:
// a plan that is already correct is left alone.
// ============================================================

const DAY = 86400

export class NeedsReview extends Error {
  /** sticky: found after Stripe was changed, so a retry must not mark the plan as fine */
  constructor(message: string, readonly sticky = false) { super(`Needs review: ${message}`) }
}

type Id = string
type Ref = string | { id: string } | null | undefined
const idOf = (r: Ref): string | null => (r == null ? null : typeof r === 'string' ? r : r.id ?? null)

export interface StripePrice { id: string; unit_amount: number | null; currency: string; recurring: { interval: string; interval_count: number } | null }
export interface StripeSubscriptionItem { id: string; price: StripePrice; quantity?: number; current_period_start?: number; current_period_end?: number }
export interface StripeSubscription {
  id: string
  object: 'subscription'
  status: string
  customer: Ref
  currency: string
  start_date: number
  billing_cycle_anchor: number
  cancel_at: number | null
  cancel_at_period_end: boolean
  schedule: Ref
  discounts?: Ref[] | null
  automatic_tax?: { enabled: boolean } | null
  default_payment_method?: Ref
  metadata?: Record<string, string>
  items: { data: StripeSubscriptionItem[] }
}
export interface StripePhase { start_date: number; end_date: number | null; [k: string]: unknown }
export interface StripeSchedule {
  id: Id
  object: 'subscription_schedule'
  status: string
  end_behavior: string
  subscription: Ref
  metadata?: Record<string, string>
  phases: StripePhase[]
}

export interface PlanResult { scheduleId: string; endsAt: number; changed: boolean }

/** Stripe's month arithmetic: same day and time N months later, clamped to the last day of a shorter month. */
export function addMonthsUTC(sec: number, n: number): number {
  const d = new Date(sec * 1000)
  const y = d.getUTCFullYear(), m = d.getUTCMonth() + n
  const lastDay = new Date(Date.UTC(y, m + 1, 0)).getUTCDate()
  const t = Date.UTC(y, m, Math.min(d.getUTCDate(), lastDay), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds())
  return Math.floor(t / 1000)
}

const isEmpty = (v: unknown) =>
  v == null || v === '' || (Array.isArray(v) && v.length === 0) || (typeof v === 'object' && !Array.isArray(v) && Object.keys(v as object).length === 0)

function discountParam(d: unknown): Record<string, string> {
  const x = d as { discount?: Ref; promotion_code?: Ref; coupon?: Ref; source?: { coupon?: Ref } }
  if (idOf(x.discount)) return { discount: idOf(x.discount)! }
  if (idOf(x.promotion_code)) return { promotion_code: idOf(x.promotion_code)! }
  const coupon = idOf(x.coupon) ?? idOf(x.source?.coupon)
  if (coupon) return { coupon }
  throw new NeedsReview('a discount on the plan has a shape this site does not recognize')
}

const ITEM_FIELDS = new Set(['price', 'plan', 'quantity', 'discounts', 'metadata', 'tax_rates', 'billing_thresholds'])
function itemParam(item: Record<string, unknown>): Record<string, unknown> {
  for (const [k, v] of Object.entries(item)) {
    if (!ITEM_FIELDS.has(k) && !isEmpty(v)) throw new NeedsReview(`the plan item has a setting this site cannot carry over safely (${k})`)
  }
  const out: Record<string, unknown> = { price: idOf(item.price as Ref) }
  if (!out.price) throw new NeedsReview('the plan item has no price')
  if (item.quantity != null) out.quantity = item.quantity
  if (Array.isArray(item.discounts) && item.discounts.length) out.discounts = item.discounts.map(discountParam)
  if (!isEmpty(item.metadata)) out.metadata = item.metadata
  if (Array.isArray(item.tax_rates) && item.tax_rates.length) out.tax_rates = item.tax_rates.map(t => idOf(t as Ref))
  if (!isEmpty(item.billing_thresholds)) out.billing_thresholds = item.billing_thresholds
  return out
}

// Every field Stripe returns on a phase, and what happens to it.
const PHASE_COPY = new Set([
  'start_date', 'items', 'discounts', 'automatic_tax', 'currency', 'default_payment_method', 'default_tax_rates',
  'collection_method', 'description', 'invoice_settings', 'metadata', 'on_behalf_of', 'proration_behavior',
  'transfer_data', 'application_fee_percent', 'billing_thresholds',
])
// Replaced by the fixed duration, or must be empty for an installment plan
const PHASE_REPLACED = new Set(['end_date'])
const PHASE_MUST_BE_EMPTY = new Set(['add_invoice_items', 'trial_end'])

/** The update parameters for a phase: everything Stripe returned, carried over as is, with a fixed length. */
export function fixedPhaseParams(phase: StripePhase, payments: number): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(phase)) {
    if (PHASE_REPLACED.has(k)) continue
    if (PHASE_MUST_BE_EMPTY.has(k)) {
      if (!isEmpty(v)) throw new NeedsReview(`the plan has ${k === 'trial_end' ? 'a trial' : 'extra one time charges'} set, which installment plans should not have`)
      continue
    }
    if (k === 'billing_cycle_anchor') {
      if (v == null || v === 'automatic') continue // keeps the subscription's existing billing anchor
      throw new NeedsReview('the plan has a custom billing date setting')
    }
    if (!PHASE_COPY.has(k)) {
      if (isEmpty(v)) continue
      throw new NeedsReview(`the plan has a setting this site cannot carry over safely (${k})`)
    }
    if (isEmpty(v) && k !== 'start_date') continue
    switch (k) {
      case 'items':
        out.items = (v as Record<string, unknown>[]).map(itemParam); break
      case 'discounts':
        out.discounts = (v as unknown[]).map(discountParam); break
      case 'automatic_tax': {
        const a = v as { enabled: boolean; liability?: { type: string; account?: Ref } | null }
        out.automatic_tax = { enabled: a.enabled, ...(a.liability ? { liability: { type: a.liability.type, ...(idOf(a.liability.account) ? { account: idOf(a.liability.account) } : {}) } } : {}) }
        break
      }
      case 'default_payment_method':
      case 'on_behalf_of':
        out[k] = idOf(v as Ref); break
      case 'default_tax_rates':
        out.default_tax_rates = (v as Ref[]).map(idOf); break
      case 'invoice_settings': {
        const s = v as { account_tax_ids?: Ref[] | null; days_until_due?: number | null; issuer?: { type: string; account?: Ref } | null }
        const inv: Record<string, unknown> = {}
        if (s.account_tax_ids?.length) inv.account_tax_ids = s.account_tax_ids.map(idOf)
        if (s.days_until_due != null) inv.days_until_due = s.days_until_due
        if (s.issuer) inv.issuer = { type: s.issuer.type, ...(idOf(s.issuer.account) ? { account: idOf(s.issuer.account) } : {}) }
        if (!isEmpty(inv)) out.invoice_settings = inv
        break
      }
      case 'transfer_data': {
        const t = v as { amount_percent?: number | null; destination: Ref }
        out.transfer_data = { destination: idOf(t.destination), ...(t.amount_percent != null ? { amount_percent: t.amount_percent } : {}) }
        break
      }
      default:
        out[k] = v
    }
  }
  if (!out.items) throw new NeedsReview('the plan has no items')
  out.duration = { interval: 'month', interval_count: payments }
  return out
}

/** Checks that the subscription is the plan the client signed up for. */
export function assertInstallmentSubscription(sub: StripeSubscription, amountCents: number) {
  if (sub.status !== 'active') throw new NeedsReview(`the subscription is ${sub.status}, not active`)
  if (sub.items.data.length !== 1) throw new NeedsReview('the subscription has more than one item')
  const it = sub.items.data[0]
  const p = it.price
  if (!p.recurring || p.recurring.interval !== 'month' || p.recurring.interval_count !== 1) throw new NeedsReview('the subscription is not billed once a month')
  if (p.unit_amount !== amountCents) throw new NeedsReview(`the subscription price is ${p.unit_amount} cents, expected ${amountCents}`)
  if ((it.quantity ?? 1) !== 1) throw new NeedsReview('the subscription quantity is not 1')
  if (sub.cancel_at_period_end) throw new NeedsReview('the subscription is already set to cancel')
}

/** True when the schedule already ends the subscription after exactly `payments` monthly payments. */
export function planIsCorrect(sched: StripeSchedule, sub: StripeSubscription, payments: number): boolean {
  if (sched.status !== 'active' || sched.end_behavior !== 'cancel' || idOf(sched.subscription) !== sub.id) return false
  if (sched.phases.length !== 1) return false
  const p = sched.phases[0]
  if (p.start_date !== sub.start_date || p.end_date == null) return false
  if (Math.abs(p.end_date - addMonthsUTC(sub.start_date, payments)) > DAY) return false
  return sub.cancel_at === p.end_date
}

/** What must not change when the plan is given an end. Returns the names of anything that did. */
export function changedSettings(before: StripeSubscription, after: StripeSubscription): string[] {
  const ids = (l?: Ref[] | null) => (l ?? []).map(idOf).sort().join(',')
  const it = (s: StripeSubscription) => s.items.data[0]
  const checks: [string, unknown, unknown][] = [
    ['customer', idOf(before.customer), idOf(after.customer)],
    ['price', it(before)?.price.id, it(after)?.price.id],
    ['quantity', it(before)?.quantity ?? 1, it(after)?.quantity ?? 1],
    ['discounts', ids(before.discounts), ids(after.discounts)],
    ['automatic tax', Boolean(before.automatic_tax?.enabled), Boolean(after.automatic_tax?.enabled)],
    ['payment method', idOf(before.default_payment_method), idOf(after.default_payment_method)],
    ['billing date', before.billing_cycle_anchor, after.billing_cycle_anchor],
    ['currency', before.currency, after.currency],
    ['metadata', JSON.stringify(before.metadata ?? {}), JSON.stringify(after.metadata ?? {})],
    ['status', before.status, after.status],
  ]
  return checks.filter(([, a, b]) => a !== b).map(([n]) => n)
}

export async function ensureFixedInstallmentPlan(
  stripe: StripeClient,
  o: { subscriptionId: string; payments: number; amountCents: number; enrollmentId: string },
): Promise<PlanResult> {
  if (!Number.isInteger(o.payments) || o.payments < 2 || o.payments > 36) throw new NeedsReview(`unexpected number of payments (${o.payments})`)
  const subPath = `/v1/subscriptions/${encodeURIComponent(o.subscriptionId)}`
  const before = await stripe.get<StripeSubscription>(subPath)
  assertInstallmentSubscription(before, o.amountCents)

  let sched: StripeSchedule
  const existing = idOf(before.schedule)
  if (existing) {
    sched = await stripe.get<StripeSchedule>(`/v1/subscription_schedules/${encodeURIComponent(existing)}`)
    if (planIsCorrect(sched, before, o.payments)) {
      return { scheduleId: sched.id, endsAt: sched.phases[0].end_date!, changed: false }
    }
    // The only other schedule this code will touch is one it created a moment
    // ago (a retry after the update step failed): one phase, release, no end set.
    const untouched = sched.status === 'active' && sched.end_behavior === 'release' && sched.phases.length === 1 && before.cancel_at == null
    if (!untouched) throw new NeedsReview('the subscription already has a different schedule in Stripe')
  } else {
    if (before.cancel_at != null) throw new NeedsReview('the subscription already has an end date set')
    sched = await stripe.post<StripeSchedule>('/v1/subscription_schedules',
      { from_subscription: before.id },
      { idempotencyKey: `bth-fixed-plan-${before.id}` })
  }

  if (sched.phases.length !== 1) throw new NeedsReview('the new schedule does not have exactly one phase')
  const phase = sched.phases[0]
  // Count from the very first payment. If billing has already moved past
  // the first month, counting from here would add an extra payment.
  if (phase.start_date !== before.start_date) throw new NeedsReview('the plan is no longer in its first month, so the payment count cannot be set automatically')

  const updated = await stripe.post<StripeSchedule>(`/v1/subscription_schedules/${encodeURIComponent(sched.id)}`, {
    end_behavior: 'cancel',
    proration_behavior: 'none',
    metadata: { ...(sched.metadata ?? {}), bth_plan: 'fixed_installments', bth_payments: String(o.payments), bth_enrollment_id: o.enrollmentId },
    phases: [fixedPhaseParams(phase, o.payments)],
  })

  const after = await stripe.get<StripeSubscription>(subPath)
  if (!planIsCorrect(updated, after, o.payments)) throw new NeedsReview(`Stripe did not confirm an end after payment ${o.payments}`, true)
  const changed = changedSettings(before, after)
  if (changed.length) throw new NeedsReview(`these settings changed when the end was set: ${changed.join(', ')}`, true)
  return { scheduleId: updated.id, endsAt: updated.phases[0].end_date!, changed: true }
}
