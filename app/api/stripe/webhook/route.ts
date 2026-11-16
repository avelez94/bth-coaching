import { NextRequest, NextResponse } from 'next/server'
import { db, getSettings } from '@/lib/site-data'
import { adminRecipient, sendEmail } from '@/lib/email'
import { sprintPurchaseEmail } from '@/lib/email-templates'
import { SPRINT_REFERENCE, usd } from '@/lib/program-info'
import { ENROLLMENT_EMAIL_COLUMNS, sendCompletionEmails, type EnrollmentRow } from '@/lib/enrollment-emails'
import { UUID, verifyStripeSignature, type CheckoutSession, type StripeCharge } from '@/lib/stripe-webhook'
import { ensureGiftForPayment, recordRefund, sendCertificateOnce, siteOrigin } from '@/lib/sprint-gifts'

// ============================================================
// POST /api/stripe/webhook
//
// The only thing that marks an enrollment Paid (completed) and the only
// thing that sends its completion emails. Reaching Stripe or coming back
// from it never does. Stripe calls this after Checkout:
//   checkout.session.completed                card payments (and $0 checkouts)
//   checkout.session.async_payment_succeeded  bank payments that clear later
//   checkout.session.async_payment_failed     bank payments that fail
//   charge.refunded                           a refund issued in Stripe
//
// Each enrollment's Stripe link carries its enrollment ID as
// client_reference_id; the Sprint links carry sprint_self or sprint_gift.
// A paid sprint_gift checkout creates one gift and emails its certificate.
// Requests without a valid Stripe signature are rejected.
// Safe to receive the same event more than once.
// ============================================================

const HANDLED = new Set(['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed', 'charge.refunded'])

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
  if (!secret) {
    console.error('[stripe] STRIPE_WEBHOOK_SECRET is not set; payment confirmations cannot be received.')
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 503 })
  }

  const raw = await req.text()
  if (!verifyStripeSignature(raw, req.headers.get('stripe-signature'), secret)) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  let event: { id: string; type: string; livemode: boolean; data: { object: CheckoutSession | StripeCharge } }
  try { event = JSON.parse(raw) } catch { return NextResponse.json({ error: 'Bad payload.' }, { status: 400 }) }
  if (!HANDLED.has(event.type)) return NextResponse.json({ received: true, ignored: event.type })

  // A Stripe test mode payment never marks a real enrollment paid on the live site
  if (!event.livemode && process.env.VERCEL_ENV === 'production') {
    return NextResponse.json({ received: true, ignored: 'test mode event on production' })
  }

  // Refund: record it, and a fully refunded gift can no longer be redeemed
  if (event.type === 'charge.refunded') {
    const ch = event.data.object as StripeCharge
    if (!ch.payment_intent) return NextResponse.json({ received: true, note: 'no payment intent' })
    try {
      const r = await recordRefund(ch.payment_intent, ch.amount_refunded ?? 0, Boolean(ch.refunded))
      return NextResponse.json({ received: true, ...r })
    } catch (err) {
      console.error('[stripe] refund processing failed:', err)
      return NextResponse.json({ error: 'Processing failed.' }, { status: 500 })
    }
  }

  const s = event.data.object as CheckoutSession
  const failed = event.type === 'checkout.session.async_payment_failed'
  const paid = !failed && (s.payment_status === 'paid' || s.payment_status === 'no_payment_required')
  const paymentStatus = failed ? 'failed' : s.payment_status
  const ref = s.client_reference_id ?? ''
  const kind = UUID.test(ref) ? 'enrollment' : ref === SPRINT_REFERENCE.self ? 'sprint_self' : ref === SPRINT_REFERENCE.gift ? 'sprint_gift' : 'other'
  const email = s.customer_details?.email ?? s.customer_email ?? null
  const name = s.customer_details?.name ?? null

  try {
    // 1. Record the payment (one row per Checkout Session)
    const { data: before } = await db().from('stripe_payments').select('payment_status').eq('stripe_session_id', s.id).maybeSingle()
    const { data: payment, error: upsertError } = await db().from('stripe_payments').upsert({
      stripe_session_id: s.id,
      stripe_event_id: event.id,
      kind,
      enrollment_id: kind === 'enrollment' ? ref : null,
      client_reference_id: ref || null,
      customer_email: email,
      customer_name: name,
      amount_total_cents: s.amount_total,
      currency: s.currency,
      payment_status: paymentStatus,
      mode: s.mode,
      livemode: s.livemode,
      ...(s.payment_intent ? { payment_intent: s.payment_intent } : {}),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'stripe_session_id' }).select('id').maybeSingle()
    if (upsertError) {
      // An enrollment ID that does not exist (deleted record) still gets recorded without the link
      if (kind === 'enrollment' && upsertError.code === '23503') {
        await db().from('stripe_payments').upsert({
          stripe_session_id: s.id, stripe_event_id: event.id, kind: 'other', client_reference_id: ref, customer_email: email,
          customer_name: name, amount_total_cents: s.amount_total, currency: s.currency, payment_status: paymentStatus,
          mode: s.mode, livemode: s.livemode, updated_at: new Date().toISOString(),
        }, { onConflict: 'stripe_session_id' })
        return NextResponse.json({ received: true, note: 'unknown enrollment' })
      }
      throw upsertError
    }
    const newlyPaid = paid && before?.payment_status !== 'paid' && before?.payment_status !== 'no_payment_required'

    const settings = await getSettings()
    const footer = { contactEmail: settings.contactEmail, phone: settings.phone }

    // 2. Coaching enrollment: on verified payment, mark it Paid (completed),
    //    store the payment, and only then email the client their signed
    //    agreement and John his paid enrollment notice. The status filter
    //    makes this happen once, however often Stripe repeats the event.
    if (kind === 'enrollment') {
      if (failed) {
        await db().from('enrollments').update({ status: 'payment_failed' }).eq('id', ref).eq('status', 'pending_payment')
      } else if (paid) {
        const { data: updated, error } = await db().from('enrollments')
          .update({ status: 'paid', paid_at: new Date().toISOString(), stripe_checkout_session_id: s.id, amount_paid_cents: s.amount_total })
          .eq('id', ref).in('status', ['pending_payment', 'payment_failed', 'abandoned'])
          .select(ENROLLMENT_EMAIL_COLUMNS)
        if (error) throw error
        const e = updated?.[0] as EnrollmentRow | undefined
        if (e) await sendCompletionEmails(e, { testMode: false })
      }
    }

    // 3. Sprint gift: on verified payment, create the gift (once per payment)
    //    and email the purchaser the certificate and John his notice (once per
    //    gift). Both are safe against Stripe repeating the event.
    if (kind === 'sprint_gift' && paid && payment?.id) {
      const gift = await ensureGiftForPayment({
        paymentId: payment.id, sessionId: s.id, name, email,
        amountCents: s.amount_total, currency: s.currency, livemode: s.livemode,
      })
      await sendCertificateOnce(gift, siteOrigin(req.nextUrl.origin))
    }

    // 4. Sprint purchase for themselves: tell John once (unchanged)
    if (kind === 'sprint_self' && newlyPaid) {
      await sendEmail({
        kind: 'sprint_purchase', to: adminRecipient(settings), ...(email ? { replyTo: email } : {}),
        ...sprintPurchaseEmail({ gift: false, name: name ?? '', email: email ?? '', amount: usd(s.amount_total ?? 0), sessionRef: s.id }, footer),
      })
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    // A 500 makes Stripe retry later, so a brief database problem loses nothing
    console.error('[stripe] webhook processing failed:', err)
    return NextResponse.json({ error: 'Processing failed.' }, { status: 500 })
  }
}
