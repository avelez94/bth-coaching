import 'server-only'
import { db, getPageContent, getSettings } from './site-data'
import { adminRecipient, sendEmail, type SendResult } from './email'
import { giftCertificateEmail, giftAdminNoticeEmail, giftRedeemedAdminEmail, giftRedeemedRecipientEmail } from './email-templates'
import { generateGiftCertificatePDF, type CertificateContent } from './gift-certificate-pdf'
import { generateCode, generateToken, redeemPath, type GiftStatus } from './sprint-gift-codes'
import { SITE_URL } from './seo'
import { usd } from './program-info'

// ============================================================
// 8 Pillar Sprint gifts.
//
// Lifecycle: Purchased → Redeemed, or Purchased → Refunded / Cancelled.
//   created   only by the verified Stripe webhook, after Stripe confirms
//             payment for a checkout that came from the gift link
//   redeemed  by the recipient on /sprint/redeem, exactly once
//   refunded  when Stripe reports the payment fully refunded
//   cancelled by John in Admin, an internal status only (no money moves)
//
// Email in Preview/local: sent only to ENROLLMENT_TEST_EMAIL, never to
// the purchaser or recipient. Production: sent to real people only once
// RESEND_FROM_EMAIL is set (until then every attempt is logged as skipped).
// ============================================================

export interface GiftRow {
  id: string
  created_at: string
  stripe_payment_id: string
  stripe_session_id: string
  token: string
  code: string
  purchaser_name: string | null
  purchaser_email: string | null
  amount_cents: number | null
  currency: string | null
  livemode: boolean
  status: GiftStatus
  certificate_claimed_at: string | null
  certificate_sent_at: string | null
  redeemed_at: string | null
  recipient_name: string | null
  recipient_email: string | null
  recipient_phone: string | null
  terms_version: string | null
  terms_accepted_at: string | null
  refunded_at: string | null
  cancelled_at: string | null
  cancel_note: string | null
}

const isProduction = () => process.env.VERCEL_ENV === 'production'

/** Base URL for redemption links: the real domain in production, the current deployment otherwise */
export function siteOrigin(requestOrigin?: string): string {
  if (isProduction() || !requestOrigin) return SITE_URL
  return requestOrigin.replace(/\/+$/, '')
}
export const redeemUrl = (origin: string, token: string) => `${origin}${redeemPath(token)}`

/** Where a gift email may go. Outside production, only to the test inbox. */
function route(realRecipient: string | null): { to: string; testMode: boolean; real: string } {
  const real = realRecipient ?? ''
  if (isProduction()) return { to: real, testMode: false, real }
  return { to: process.env.ENROLLMENT_TEST_EMAIL?.trim() ?? '', testMode: true, real }
}

// ------------------------------------------------------------
// Creation (webhook)
// ------------------------------------------------------------

/**
 * Makes sure a gift exists for a paid gift checkout. Safe to call any
 * number of times for the same payment: the database allows one gift per
 * payment and per Stripe session, so a repeat returns the existing gift
 * and never creates a second token or code.
 */
export async function ensureGiftForPayment(p: {
  paymentId: string; sessionId: string; name: string | null; email: string | null
  amountCents: number | null; currency: string | null; livemode: boolean
}): Promise<GiftRow> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const { error } = await db().from('sprint_gifts').insert({
      stripe_payment_id: p.paymentId, stripe_session_id: p.sessionId,
      token: generateToken(), code: generateCode(),
      purchaser_name: p.name, purchaser_email: p.email,
      amount_cents: p.amountCents, currency: p.currency, livemode: p.livemode,
    })
    if (!error) break
    if (error.code !== '23505') throw error
    // Unique violation: either this payment already has its gift (a repeated
    // event), or, astronomically unlikely, a code collided. Check which.
    const existing = await giftBySession(p.sessionId)
    if (existing) return existing
  }
  const gift = await giftBySession(p.sessionId)
  if (!gift) throw new Error('Gift could not be created.')
  return gift
}

async function giftBySession(sessionId: string): Promise<GiftRow | null> {
  const { data, error } = await db().from('sprint_gifts').select('*').eq('stripe_session_id', sessionId).maybeSingle()
  if (error) throw error
  return data as GiftRow | null
}

export async function giftById(id: string): Promise<GiftRow | null> {
  const { data, error } = await db().from('sprint_gifts').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data as GiftRow | null
}

/**
 * Sends the certificate the first time only. The claim is a single
 * conditional update, so two copies of the same Stripe event arriving
 * together still send one email. If building the PDF fails, the claim is
 * released and the error rethrown, so Stripe's retry tries again.
 */
export async function sendCertificateOnce(gift: GiftRow, origin: string): Promise<SendResult | null> {
  const { data: claimed, error } = await db().from('sprint_gifts')
    .update({ certificate_claimed_at: new Date().toISOString() })
    .eq('id', gift.id).is('certificate_claimed_at', null).select('id')
  if (error) throw error
  if (!claimed?.length) return null // already sent (or being sent) for this gift
  try {
    const result = await sendCertificate(gift, origin)
    await notifyJohnOfGift(gift)
    return result
  } catch (e) {
    await db().from('sprint_gifts').update({ certificate_claimed_at: null }).eq('id', gift.id)
    throw e
  }
}

async function certificateContent(gift: GiftRow, origin: string, testMode: boolean): Promise<CertificateContent> {
  const [c, settings] = await Promise.all([getPageContent('sprint'), getSettings()])
  const term = (n: number) => [c[`refund.${n}.lead` as keyof typeof c], c[`refund.${n}.text` as keyof typeof c]].filter(Boolean).join(' ')
  return {
    purchaserName: gift.purchaser_name,
    recipientName: null,
    code: gift.code,
    link: redeemUrl(origin, gift.token),
    registerBy: c['details.register'],
    dates: c['details.dates'],
    time: c['details.time'],
    format: c['details.format'],
    // The Sprint page's own refund and transfer terms that bear on a gift,
    // word for word: the deadline term, the after deadline term, the gift term
    terms: [term(1), term(2), term(5)].filter(Boolean),
    contactName: 'John McCracken',
    contactEmail: settings.contactEmail,
    contactPhone: settings.phone,
    website: SITE_URL.replace(/^https?:\/\//, ''),
    testMode: testMode || !gift.livemode,
  }
}

/** Builds the PDF and emails it to the purchaser (also used by Admin, Resend certificate) */
export async function sendCertificate(gift: GiftRow, origin: string): Promise<SendResult> {
  const r = route(gift.purchaser_email)
  const content = await certificateContent(gift, origin, r.testMode)
  const pdf = await generateGiftCertificatePDF(content)
  const settings = await getSettings()
  const email = giftCertificateEmail({
    purchaserName: gift.purchaser_name, code: gift.code, link: content.link, registerBy: content.registerBy,
    giftTerm: content.terms[content.terms.length - 1] ?? '',
  }, { contactEmail: settings.contactEmail, phone: settings.phone }, r.testMode ? r.real : null)
  const result = await sendEmail({
    kind: 'gift_certificate', to: r.to, ...email, replyTo: settings.contactEmail,
    attachments: [{ filename: `8-Pillar-Sprint-Gift-Certificate-${gift.code}.pdf`, content: Buffer.from(pdf) }],
    giftId: gift.id, testMode: r.testMode,
  })
  if (result.status === 'sent') {
    await db().from('sprint_gifts').update({ certificate_sent_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', gift.id)
  }
  return result
}

async function notifyJohnOfGift(gift: GiftRow) {
  const settings = await getSettings()
  const r = isProduction() ? { to: adminRecipient(settings), testMode: false } : { to: process.env.ENROLLMENT_TEST_EMAIL?.trim() ?? '', testMode: true }
  await sendEmail({
    kind: 'sprint_purchase', to: r.to, ...(gift.purchaser_email ? { replyTo: gift.purchaser_email } : {}),
    ...giftAdminNoticeEmail({
      name: gift.purchaser_name ?? '', email: gift.purchaser_email ?? '', amount: usd(gift.amount_cents ?? 0),
      code: gift.code, sessionRef: gift.stripe_session_id,
    }, { contactEmail: settings.contactEmail, phone: settings.phone }),
    giftId: gift.id, testMode: r.testMode,
  })
}

// ------------------------------------------------------------
// Redemption
// ------------------------------------------------------------

export type PublicGiftState =
  | { state: 'invalid' }
  | { state: 'redeemed' | 'refunded' | 'cancelled' }
  | { state: 'valid'; code: string; purchaserFirstName: string | null }

/** What the redemption page may show. Never returns anyone's email or the recipient. */
export async function publicGiftState(by: { token?: string; code?: string }): Promise<PublicGiftState & { token?: string }> {
  const q = db().from('sprint_gifts').select('token, code, status, purchaser_name')
  const { data, error } = by.token ? await q.eq('token', by.token).maybeSingle() : by.code ? await q.eq('code', by.code).maybeSingle() : { data: null, error: null }
  if (error) throw error
  if (!data) return { state: 'invalid' }
  if (data.status !== 'purchased') return { state: data.status as 'redeemed' | 'refunded' | 'cancelled' }
  return { state: 'valid', code: data.code, purchaserFirstName: firstName(data.purchaser_name), token: data.token }
}

const firstName = (n: string | null) => (n ?? '').trim().split(/\s+/)[0] || null

export interface Registration { name: string; email: string; phone: string | null; termsVersion: string | null }

/**
 * Redeems a gift for one participant. One conditional UPDATE: it changes
 * the row only while the status is still Purchased, so of two
 * simultaneous attempts exactly one succeeds, and a Redeemed, Refunded or
 * Cancelled gift can never be redeemed.
 */
export async function redeemGift(token: string, reg: Registration): Promise<{ ok: true; gift: GiftRow } | { ok: false; state: 'invalid' | 'redeemed' | 'refunded' | 'cancelled' }> {
  const now = new Date().toISOString()
  const { data, error } = await db().from('sprint_gifts').update({
    status: 'redeemed', redeemed_at: now, updated_at: now,
    recipient_name: reg.name, recipient_email: reg.email, recipient_phone: reg.phone,
    ...(reg.termsVersion ? { terms_version: reg.termsVersion, terms_accepted_at: now } : {}),
  }).eq('token', token).eq('status', 'purchased').select('*')
  if (error) throw error
  if (data?.length) return { ok: true, gift: data[0] as GiftRow }
  const s = await publicGiftState({ token })
  return { ok: false, state: s.state === 'valid' ? 'redeemed' : s.state }
}

export async function sendRedemptionEmails(gift: GiftRow) {
  const [c, settings] = await Promise.all([getPageContent('sprint'), getSettings()])
  const footer = { contactEmail: settings.contactEmail, phone: settings.phone }
  const details: [string, string][] = [
    [c['details.dates.label'], c['details.dates']], [c['details.time.label'], c['details.time']],
    [c['details.format.label'], c['details.format']], [c['details.prep.label'], c['details.prep']],
  ]
  const r = route(gift.recipient_email)
  await sendEmail({
    kind: 'gift_redeemed_recipient', to: r.to, replyTo: settings.contactEmail,
    ...giftRedeemedRecipientEmail({ name: gift.recipient_name ?? '', purchaserName: gift.purchaser_name, details }, footer, r.testMode ? r.real : null),
    giftId: gift.id, testMode: r.testMode,
  })
  const a = isProduction() ? { to: adminRecipient(settings), testMode: false } : { to: process.env.ENROLLMENT_TEST_EMAIL?.trim() ?? '', testMode: true }
  await sendEmail({
    kind: 'gift_redeemed_admin', to: a.to, ...(gift.recipient_email ? { replyTo: gift.recipient_email } : {}),
    ...giftRedeemedAdminEmail({
      recipientName: gift.recipient_name ?? '', recipientEmail: gift.recipient_email ?? '', recipientPhone: gift.recipient_phone,
      purchaserName: gift.purchaser_name ?? '', purchaserEmail: gift.purchaser_email ?? '', code: gift.code,
    }, footer),
    giftId: gift.id, testMode: a.testMode,
  })
}

// ------------------------------------------------------------
// Refunds (webhook) and internal cancel (Admin)
// ------------------------------------------------------------

/**
 * Stripe reported a refund on a charge. Records it on the payment; when
 * the payment is fully refunded, its gift becomes Refunded, which blocks
 * redemption if it has not been used. A partial refund is recorded but
 * leaves the gift as it was. Repeats are harmless.
 */
export async function recordRefund(paymentIntent: string, amountRefundedCents: number, fullyRefunded: boolean): Promise<{ payment: boolean; gift: boolean }> {
  const now = new Date().toISOString()
  const { data: payments, error } = await db().from('stripe_payments')
    .update({ amount_refunded_cents: amountRefundedCents, ...(fullyRefunded ? { refunded_at: now } : {}), updated_at: now })
    .eq('payment_intent', paymentIntent).select('id')
  if (error) throw error
  if (!payments?.length) return { payment: false, gift: false }
  if (!fullyRefunded) return { payment: true, gift: false }
  const { data: gifts, error: gErr } = await db().from('sprint_gifts')
    .update({ status: 'refunded', refunded_at: now, updated_at: now })
    .in('stripe_payment_id', payments.map(p => p.id)).in('status', ['purchased', 'redeemed']).select('id')
  if (gErr) throw gErr
  return { payment: true, gift: Boolean(gifts?.length) }
}

/** Admin: mark an unused gift Cancelled (internal status, no money moves) */
export async function cancelGift(id: string, note: string | null): Promise<boolean> {
  const now = new Date().toISOString()
  const { data, error } = await db().from('sprint_gifts')
    .update({ status: 'cancelled', cancelled_at: now, cancel_note: note, updated_at: now })
    .eq('id', id).eq('status', 'purchased').select('id')
  if (error) throw error
  return Boolean(data?.length)
}
