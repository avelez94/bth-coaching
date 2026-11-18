// ============================================================
// BTH Coaching: Program configuration
//
// Pricing and Stripe payment links live in the database
// (program_pricing), edited by John in Admin > Pricing & Payments.
// That table is the single source of truth. The values below are
// only a fallback used if the database cannot be reached, and they
// match the launch pricing.
//
// Program names and descriptions are fixed here.
// ============================================================

export type ProgramKey = 'executive-coaching' | '8-pillars'
export const PROGRAM_KEYS: ProgramKey[] = ['executive-coaching', '8-pillars']

export function isProgramKey(value: string): value is ProgramKey {
  return PROGRAM_KEYS.includes(value as ProgramKey)
}

// Raw pricing as stored in the database
export interface ProgramPricing {
  fullPriceCents: number
  installmentAmountCents: number
  installmentCount: number
  stripeFullUrl: string
  stripeInstallmentUrl: string
}

// ------------------------------------------------------------
// 8 Pillar Sprint: one price, two Stripe links (for yourself,
// or as a gift). No installment plan and no coaching agreement.
// Joining yourself: a short registration on /sprint/register, then
// Stripe. A gift: straight to Stripe; the recipient registers later
// on /sprint/redeem, by the gift redemption deadline.
// ------------------------------------------------------------
export interface SprintPricing {
  priceCents: number
  stripeEnrollUrl: string
  stripeGiftUrl: string
  /**
   * The Sprint registration deadline, 11:59:59 PM Eastern on the chosen day
   * (ISO time). One date for everything: registering, claiming a gift, and
   * the last day for a refund or transfer in the Sprint copy.
   */
  giftRedeemBy: string
}

export const DEFAULT_SPRINT_PRICING: SprintPricing = {
  priceCents: 45000,
  stripeEnrollUrl: 'https://buy.stripe.com/eVq6oH9Pv3f70w784A3sI05',
  stripeGiftUrl: 'https://buy.stripe.com/4gM14n4vbaHz3Ij4So3sI04',
  giftRedeemBy: '2027-01-10T23:59:59-05:00',
}

// ---------- Eastern Time dates (safe in the browser and on the server) ----------
const EASTERN = 'America/New_York'

/** "2027-01-10" for an instant, as the calendar date in Eastern Time */
export function easternDate(iso: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: EASTERN, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(iso))
  const v = (t: string) => parts.find(p => p.type === t)?.value ?? ''
  return `${v('year')}-${v('month')}-${v('day')}`
}

/** 11:59:59 PM Eastern on a calendar date ("2027-01-10"), as an ISO time with the right offset (EST or EDT) */
export function endOfDayEastern(date: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  const noonUtc = new Date(`${date}T12:00:00Z`)
  if (Number.isNaN(noonUtc.getTime()) || noonUtc.toISOString().slice(0, 10) !== date) return null
  const name = new Intl.DateTimeFormat('en-US', { timeZone: EASTERN, timeZoneName: 'shortOffset' })
    .formatToParts(noonUtc).find(p => p.type === 'timeZoneName')?.value ?? 'GMT-5'
  const m = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/)
  const off = m ? `${m[1]}${m[2].padStart(2, '0')}:${m[3] ?? '00'}` : '-05:00'
  return `${date}T23:59:59${off}`
}

/** "January 10, 2027" */
export function formatEasternDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: EASTERN, month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(iso))
}

/** "January 10" */
export function formatEasternMonthDay(iso: string): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: EASTERN, month: 'long', day: 'numeric' }).format(new Date(iso))
}

/** True once the Sprint registration deadline (also the gift claim deadline) has passed */
export function giftRedemptionClosed(redeemBy: string, now = new Date()): boolean {
  const t = new Date(redeemBy).getTime()
  return Number.isFinite(t) && now.getTime() > t
}
export const sprintRegistrationClosed = giftRedemptionClosed

/** Fills {deadline} ("January 10, 2027") and {deadline_short} ("January 10") */
export function fillDeadline(text: string, deadlineIso: string): string {
  if (!text.includes('{deadline')) return text
  return text.replaceAll('{deadline_short}', formatEasternMonthDay(deadlineIso)).replaceAll('{deadline}', formatEasternDate(deadlineIso))
}

export const SPRINT_LABEL = '8 Pillar Sprint'

// Tags added to the Sprint Stripe links so the payment webhook can tell
// a purchase for yourself from a gift. Not secret.
export const SPRINT_REFERENCE = { self: 'sprint_self', gift: 'sprint_gift' } as const

// Public Sprint info for the page: price and the two checkout links
export interface PublicSprintInfo {
  price: string                // "$450"
  priceCents: number
  enrollUrl: string
  giftUrl: string
}

export function withReference(url: string, ref: string, email?: string): string {
  try {
    const u = new URL(url)
    u.searchParams.set('client_reference_id', ref)
    if (email) u.searchParams.set('prefilled_email', email)
    return u.toString()
  } catch {
    return url
  }
}

// Self purchase: registration first, then Stripe with this reference
export const SPRINT_REGISTER_PATH = '/sprint/register'
export const sprintSelfReference = (registrationId: string) => `${SPRINT_REFERENCE.self}_${registrationId}`
/** The registration ID inside a self purchase reference, or null */
export function sprintRegistrationId(ref: string | null | undefined): string | null {
  const m = (ref ?? '').match(/^sprint_self_([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i)
  return m ? m[1].toLowerCase() : null
}

export function sprintPublic(p: SprintPricing): PublicSprintInfo {
  return {
    price: usd(p.priceCents),
    priceCents: p.priceCents,
    enrollUrl: SPRINT_REGISTER_PATH,
    giftUrl: withReference(p.stripeGiftUrl, SPRINT_REFERENCE.gift),
  }
}

// Display-ready program info, safe to send to the browser (no Stripe links)
export interface PublicProgramInfo {
  label: string
  description: string
  fullPrice: string            // "$3,600"
  fullPriceCents: number
  fullNote: string
  totalCost: string            // "$3,600"
  installmentCount: number
  installmentAmount: string    // "$600"
  installmentAmountCents: number
  installmentNote: string      // "6 monthly payments of $600"
}

// Server-side only: includes Stripe links for routing after signing
export interface ProgramConfig extends PublicProgramInfo {
  stripeLinks: { full: string; installment: string }
}

const STATIC: Record<ProgramKey, { label: string; description: string }> = {
  'executive-coaching': {
    label: 'Executive Coaching',
    description:
      'One-on-one executive coaching with John McCracken. Tailored to your goals, grounded in the 8 Pillars of Whole Person Leadership.',
  },
  '8-pillars': {
    label: '8 Pillars Leadership Program',
    description:
      'A structured leadership development program built on the 8 Pillars framework. Combines group sessions with individual coaching.',
  },
}

export const DEFAULT_PRICING: Record<ProgramKey, ProgramPricing> = {
  'executive-coaching': {
    fullPriceCents: 360000,
    installmentAmountCents: 60000,
    installmentCount: 6,
    stripeFullUrl: 'https://buy.stripe.com/8x23cvf9P9Dva6H1Gc3sI00',
    stripeInstallmentUrl: 'https://buy.stripe.com/28E4gze5L5nfgv5gB63sI01',
  },
  '8-pillars': {
    fullPriceCents: 600000,
    installmentAmountCents: 60000,
    installmentCount: 10,
    stripeFullUrl: 'https://buy.stripe.com/9B6fZh5zf5nf6Uvfx23sI02',
    stripeInstallmentUrl: 'https://buy.stripe.com/7sY28r3r77vn4MnesY3sI03',
  },
}

// "$3,600" for whole dollars, "$3,600.50" otherwise
export function usd(cents: number): string {
  const dollars = cents / 100
  return '$' + dollars.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(dollars) ? 0 : 2,
    maximumFractionDigits: 2,
  })
}

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
export function countWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n)
}

export function buildProgramConfig(key: ProgramKey, p: ProgramPricing): ProgramConfig {
  const fullPrice = usd(p.fullPriceCents)
  const installmentAmount = usd(p.installmentAmountCents)
  return {
    ...STATIC[key],
    fullPrice,
    fullPriceCents: p.fullPriceCents,
    fullNote: 'Single payment',
    totalCost: fullPrice,
    installmentCount: p.installmentCount,
    installmentAmount,
    installmentAmountCents: p.installmentAmountCents,
    installmentNote: `${p.installmentCount} monthly payments of ${installmentAmount}`,
    stripeLinks: { full: p.stripeFullUrl, installment: p.stripeInstallmentUrl },
  }
}

export function toPublic(c: ProgramConfig): PublicProgramInfo {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { stripeLinks, ...rest } = c
  return rest
}

export function programLabel(key: ProgramKey): string {
  return STATIC[key].label
}
