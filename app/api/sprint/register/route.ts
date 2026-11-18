import { NextRequest, NextResponse } from 'next/server'
import { getSprintPricing, isPageActive } from '@/lib/site-data'
import { createRegistration } from '@/lib/sprint-registration'
import { formatEasternDate, sprintRegistrationClosed, sprintSelfReference, withReference } from '@/lib/program-info'
import { SPRINT_PARTICIPANT_TERMS } from '@/lib/sprint-terms'

// ============================================================
// POST /api/sprint/register
// Someone joining the 8 Pillar Sprint themselves registers, then is
// sent to the existing Stripe link for this registration. Nothing is
// marked paid here: only the verified Stripe webhook does that.
// Responses contain no one's details.
// ============================================================

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NO_STORE = { 'Cache-Control': 'no-store' }
const fail = (error: string, status: number) => NextResponse.json({ error }, { status, headers: NO_STORE })

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try { body = await req.json() } catch { return fail('Something went wrong. Please try again.', 400) }

  const name = typeof body.name === 'string' ? body.name.trim().replace(/\s+/g, ' ') : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  if (name.length < 2 || name.length > 120) return fail('Please enter your full name.', 400)
  if (!EMAIL.test(email) || email.length > 254) return fail('Please enter a valid email address.', 400)
  if (phone.length > 40) return fail('Please check your phone number.', 400)

  // Sprint participant terms (approved by John): the box must be ticked
  if (SPRINT_PARTICIPANT_TERMS && body.acceptTerms !== true) {
    return fail('Please confirm you have read and accept the terms.', 400)
  }

  try {
    if (!(await isPageActive('sprint'))) return fail('Registration for the 8 Pillar Sprint is not open right now.', 409)
    const sprint = await getSprintPricing()
    if (sprintRegistrationClosed(sprint.giftRedeemBy)) return fail(`Registration for the 8 Pillar Sprint closed on ${formatEasternDate(sprint.giftRedeemBy)}.`, 410)
    const reg = await createRegistration({ name, email, phone: phone || null, termsVersion: SPRINT_PARTICIPANT_TERMS?.version ?? null })
    // Same Stripe link as before, tagged with this registration, email prefilled
    const url = withReference(sprint.stripeEnrollUrl, sprintSelfReference(reg.id), email)
    return NextResponse.json({ url }, { headers: NO_STORE })
  } catch (err) {
    console.error('[sprint] registration failed:', err)
    return fail('Something went wrong on our side. Please try again in a moment.', 500)
  }
}
