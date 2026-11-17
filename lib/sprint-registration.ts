import 'server-only'
import { db, getPageContent, getSettings } from './site-data'
import { adminRecipient, sendEmail } from './email'
import { sprintPurchaseEmail, sprintRegisteredEmail } from './email-templates'
import { usd } from './program-info'

// ============================================================
// 8 Pillar Sprint: someone joining for themselves.
//
//   1. /sprint/register: name, email, phone (optional) and, once John
//      approves them, the Sprint participant terms. A registration is
//      saved as Awaiting payment.
//   2. They continue to the existing Stripe link, tagged with their
//      registration (client_reference_id sprint_self_<id>) and with
//      their email prefilled so they do not type it again.
//   3. Only the verified Stripe webhook marks it Paid, once, however
//      often Stripe repeats the event; then the participant gets their
//      confirmation and John his notice.
//
// The standard coaching agreement is never used for the Sprint.
// ============================================================

export interface SprintRegistrationRow {
  id: string
  created_at: string
  name: string
  email: string
  phone: string | null
  status: 'pending_payment' | 'paid' | 'payment_failed'
  terms_version: string | null
  terms_accepted_at: string | null
  stripe_session_id: string | null
  stripe_payment_id: string | null
  amount_paid_cents: number | null
  paid_at: string | null
  livemode: boolean | null
}

const isProduction = () => process.env.VERCEL_ENV === 'production'

export async function createRegistration(r: { name: string; email: string; phone: string | null; termsVersion: string | null }): Promise<SprintRegistrationRow> {
  const now = new Date().toISOString()
  const { data, error } = await db().from('sprint_registrations').insert({
    name: r.name, email: r.email, phone: r.phone,
    ...(r.termsVersion ? { terms_version: r.termsVersion, terms_accepted_at: now } : {}),
  }).select('*').single()
  if (error) throw error
  return data as SprintRegistrationRow
}

/**
 * Called by the verified webhook. One conditional update: the row changes
 * only while it is not yet Paid, so a repeated event returns null and
 * nothing is sent twice.
 */
export async function markRegistrationPaid(id: string, p: {
  sessionId: string; paymentId: string | null; amountCents: number | null; livemode: boolean
}): Promise<SprintRegistrationRow | null> {
  const now = new Date().toISOString()
  const { data, error } = await db().from('sprint_registrations').update({
    status: 'paid', paid_at: now, updated_at: now, stripe_session_id: p.sessionId,
    stripe_payment_id: p.paymentId, amount_paid_cents: p.amountCents, livemode: p.livemode,
  }).eq('id', id).in('status', ['pending_payment', 'payment_failed']).select('*')
  if (error) throw error
  return (data?.[0] as SprintRegistrationRow | undefined) ?? null
}

export async function markRegistrationFailed(id: string, sessionId: string) {
  const { error } = await db().from('sprint_registrations')
    .update({ status: 'payment_failed', stripe_session_id: sessionId, updated_at: new Date().toISOString() })
    .eq('id', id).eq('status', 'pending_payment')
  if (error) throw error
}

/** Confirmation to the participant and a notice to John (test inbox outside production) */
export async function sendRegistrationEmails(r: SprintRegistrationRow) {
  const [c, settings] = await Promise.all([getPageContent('sprint'), getSettings()])
  const footer = { contactEmail: settings.contactEmail, phone: settings.phone }
  const testInbox = process.env.ENROLLMENT_TEST_EMAIL?.trim() ?? ''
  const prod = isProduction()
  const details: [string, string][] = [
    [c['details.dates.label'], c['details.dates']], [c['details.time.label'], c['details.time']],
    [c['details.format.label'], c['details.format']], [c['details.prep.label'], c['details.prep']],
  ]
  await sendEmail({
    kind: 'sprint_registered', to: prod ? r.email : testInbox, replyTo: settings.contactEmail,
    ...sprintRegisteredEmail({ name: r.name, details }, footer, prod ? null : r.email),
    testMode: !prod,
  })
  await sendEmail({
    kind: 'sprint_purchase', to: prod ? adminRecipient(settings) : testInbox, replyTo: r.email,
    ...sprintPurchaseEmail({ gift: false, name: r.name, email: r.email, phone: r.phone, amount: usd(r.amount_paid_cents ?? 0), sessionRef: r.stripe_session_id ?? '' }, footer),
    testMode: !prod,
  })
}
