import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { db, getPricing, getSprintPricing } from '@/lib/site-data'
import { PROGRAM_KEYS, endOfDayEastern, type ProgramKey, type ProgramPricing, type SprintPricing } from '@/lib/program-info'

// GET /api/admin/pricing: current prices and Stripe links for every program
export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [pricing, sprint] = await Promise.all([getPricing(), getSprintPricing()])
  return NextResponse.json({ pricing, sprint })
}

const isStripe = (u: unknown) => typeof u === 'string' && /^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_]+$/.test(u.trim())

function validateSprint(p: SprintPricing): string[] {
  const errs: string[] = []
  if (!Number.isInteger(p.priceCents) || p.priceCents < 1000 || p.priceCents > 10000000) errs.push('Sprint price must be between $10 and $100,000.')
  if (!isStripe(p.stripeEnrollUrl)) errs.push('The enroll link must be a Stripe payment link starting with https://buy.stripe.com/')
  if (!isStripe(p.stripeGiftUrl)) errs.push('The gift link must be a Stripe payment link starting with https://buy.stripe.com/')
  // Must be 11:59:59 PM Eastern on a real calendar date, as the Admin form sends it
  const day = typeof p.giftRedeemBy === 'string' ? p.giftRedeemBy.slice(0, 10) : ''
  if (!day || endOfDayEastern(day) !== p.giftRedeemBy) errs.push('Choose the last day a gift can be claimed.')
  return errs
}

function validate(p: ProgramPricing): string[] {
  const errs: string[] = []
  const isInt = (n: unknown) => typeof n === 'number' && Number.isInteger(n)
  if (!isInt(p.fullPriceCents) || p.fullPriceCents < 10000 || p.fullPriceCents > 10000000) errs.push('Program price must be between $100 and $100,000.')
  if (!isInt(p.installmentCount) || p.installmentCount < 2 || p.installmentCount > 36) errs.push('Number of installments must be between 2 and 36.')
  if (!isInt(p.installmentAmountCents) || p.installmentAmountCents < 1000) errs.push('Installment amount must be at least $10.')
  if (!isStripe(p.stripeFullUrl)) errs.push('Pay-in-full link must be a Stripe payment link starting with https://buy.stripe.com/')
  if (!isStripe(p.stripeInstallmentUrl)) errs.push('Installment link must be a Stripe payment link starting with https://buy.stripe.com/')
  return errs
}

// PUT /api/admin/pricing
//   Body: { program: ProgramKey, pricing: ProgramPricing }  or  { program: 'sprint', sprint: SprintPricing }
// Affects future enrollments only. Each enrollment stores the price it was signed at.
export async function PUT(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  if (body?.program === 'sprint') {
    const sp = body?.sprint as SprintPricing
    if (!sp) return NextResponse.json({ error: 'Nothing to save.' }, { status: 400 })
    const errs = validateSprint(sp)
    if (errs.length) return NextResponse.json({ error: errs.join(' ') }, { status: 400 })
    const { error } = await db().from('program_pricing').upsert({
      program_key: 'sprint',
      full_price_cents: sp.priceCents,
      stripe_full_url: sp.stripeEnrollUrl.trim(),
      stripe_gift_url: sp.stripeGiftUrl.trim(),
      gift_redeem_by: sp.giftRedeemBy,
      installment_amount_cents: null,
      installment_count: null,
      stripe_installment_url: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'program_key' })
    if (error) return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 })
    const [pricing, sprint] = await Promise.all([getPricing(), getSprintPricing()])
    return NextResponse.json({ pricing, sprint })
  }
  const program = body?.program as ProgramKey
  const p = body?.pricing as ProgramPricing
  if (!PROGRAM_KEYS.includes(program) || !p) return NextResponse.json({ error: 'Nothing to save.' }, { status: 400 })
  const errs = validate(p)
  if (errs.length) return NextResponse.json({ error: errs.join(' ') }, { status: 400 })

  const { error } = await db().from('program_pricing').upsert({
    program_key: program,
    full_price_cents: p.fullPriceCents,
    installment_amount_cents: p.installmentAmountCents,
    installment_count: p.installmentCount,
    stripe_full_url: p.stripeFullUrl.trim(),
    stripe_installment_url: p.stripeInstallmentUrl.trim(),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'program_key' })
  if (error) return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 })
  const [pricing, sprint] = await Promise.all([getPricing(), getSprintPricing()])
  return NextResponse.json({ pricing, sprint })
}
