import { NextRequest, NextResponse } from 'next/server'
import { isToken, REDEEM_MESSAGE } from '@/lib/sprint-gift-codes'
import { redeemGift, sendRedemptionEmails } from '@/lib/sprint-gifts'
import { SPRINT_PARTICIPANT_TERMS } from '@/lib/sprint-terms'

// ============================================================
// POST /api/sprint/redeem
// The recipient of a Sprint gift registers and claims the seat.
// Everything is checked here on the server; the page's checks are
// only a convenience. Responses never contain anyone's details,
// only the plain-language state of the gift.
// ============================================================

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NO_STORE = { 'Cache-Control': 'no-store' }

const fail = (error: string, status: number, state?: string) =>
  NextResponse.json({ error, ...(state ? { state } : {}) }, { status, headers: NO_STORE })

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try { body = await req.json() } catch { return fail('Something went wrong. Please try again.', 400) }

  const token = body.token
  if (!isToken(token)) return fail(REDEEM_MESSAGE.invalid, 404, 'invalid')

  const name = typeof body.name === 'string' ? body.name.trim().replace(/\s+/g, ' ') : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  if (name.length < 2 || name.length > 120) return fail('Please enter your full name.', 400)
  if (!EMAIL.test(email) || email.length > 254) return fail('Please enter a valid email address.', 400)
  if (phone.length > 40) return fail('Please check your phone number.', 400)

  // Sprint participant terms: only when John has approved them (currently none)
  if (SPRINT_PARTICIPANT_TERMS && body.acceptTerms !== true) {
    return fail('Please confirm you have read and accept the terms.', 400)
  }

  try {
    const r = await redeemGift(token, { name, email, phone: phone || null, termsVersion: SPRINT_PARTICIPANT_TERMS?.version ?? null })
    if (!r.ok) {
      const status = r.state === 'invalid' ? 404 : 409
      return fail(REDEEM_MESSAGE[r.state], status, r.state)
    }
    // The gift is already Redeemed; email problems never undo that
    try { await sendRedemptionEmails(r.gift) } catch (e) { console.error('[gift] redemption emails failed:', e) }
    return NextResponse.json({ ok: true }, { headers: NO_STORE })
  } catch (err) {
    console.error('[gift] redemption failed:', err)
    return fail('Something went wrong on our side. Please try again in a moment.', 500)
  }
}
