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
