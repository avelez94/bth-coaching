// ============================================================
// BTH Coaching: Program configuration — single source of truth
// Used by: enrollment flow, admin, submit API, PDF generation
// ============================================================

export type ProgramKey = 'executive-coaching' | '8-pillars'

export interface ProgramConfig {
  label: string
  description: string
  fullPrice: string
  fullPriceCents: number
  fullNote: string
  totalCost: string
  installmentCount: number
  installmentAmount: string
  installmentAmountCents: number
  installmentNote: string
}

export const PROGRAM_INFO: Record<ProgramKey, ProgramConfig> = {
  'executive-coaching': {
    label: 'Executive Coaching',
    description:
      'One-on-one executive coaching with John McCracken. Tailored to your goals, grounded in the 8 Pillars of Whole Person Leadership.',
    fullPrice: '$3,600',
    fullPriceCents: 360000,
    fullNote: 'Single payment',
    totalCost: '$3,600',
    installmentCount: 6,
    installmentAmount: '$600',
    installmentAmountCents: 60000,
    installmentNote: '6 monthly payments of $600',
  },
  '8-pillars': {
    label: '8 Pillars Leadership Program',
    description:
      'A structured leadership development program built on the 8 Pillars framework. Combines group sessions with individual coaching.',
    fullPrice: '$6,000',
    fullPriceCents: 600000,
    fullNote: 'Single payment',
    totalCost: '$6,000',
    installmentCount: 10,
    installmentAmount: '$600',
    installmentAmountCents: 60000,
    installmentNote: '10 monthly payments of $600',
  },
} as const

export const PROGRAM_KEYS: ProgramKey[] = ['executive-coaching', '8-pillars']

export function isProgramKey(value: string): value is ProgramKey {
  return PROGRAM_KEYS.includes(value as ProgramKey)
}
