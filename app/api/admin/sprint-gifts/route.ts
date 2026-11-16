import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { db } from '@/lib/site-data'
import { cancelGift, giftById, redeemUrl, sendCertificate, siteOrigin, type GiftRow } from '@/lib/sprint-gifts'

// ============================================================
// Admin: Sprint gifts.
//   GET   every gift, newest first, with its payment's refund state and
//         the outcome of the last certificate email
//   POST  { action: 'resend', id }          email the certificate again
//         { action: 'cancel', id, note? }   internal status only
// Neither action can redeem a gift or create a participant.
// ============================================================

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: gifts, error } = await db().from('sprint_gifts').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: 'Could not load gifts.' }, { status: 500 })
  const rows = (gifts ?? []) as GiftRow[]

  const paymentIds = rows.map(g => g.stripe_payment_id)
  const giftIds = rows.map(g => g.id)
  const [{ data: payments }, { data: emails }] = await Promise.all([
    paymentIds.length
      ? db().from('stripe_payments').select('id, payment_intent, amount_refunded_cents, refunded_at').in('id', paymentIds)
      : Promise.resolve({ data: [] as { id: string; payment_intent: string | null; amount_refunded_cents: number | null; refunded_at: string | null }[] }),
    giftIds.length
      ? db().from('email_log').select('gift_id, kind, status, created_at, error').in('gift_id', giftIds).eq('kind', 'gift_certificate').order('created_at', { ascending: false })
      : Promise.resolve({ data: [] as { gift_id: string; kind: string; status: string; created_at: string; error: string | null }[] }),
  ])
  const payBy = new Map((payments ?? []).map(p => [p.id, p]))
  const lastEmail = new Map<string, { status: string; created_at: string; error: string | null }>()
  for (const e of emails ?? []) if (!lastEmail.has(e.gift_id)) lastEmail.set(e.gift_id, e)

  const origin = siteOrigin(req.nextUrl.origin)
  return NextResponse.json({
    gifts: rows.map(g => {
      const pay = payBy.get(g.stripe_payment_id)
      return {
        id: g.id, created_at: g.created_at, code: g.code, status: g.status, livemode: g.livemode,
        purchaser_name: g.purchaser_name, purchaser_email: g.purchaser_email, amount_cents: g.amount_cents,
        stripe_session_id: g.stripe_session_id, payment_intent: pay?.payment_intent ?? null,
        amount_refunded_cents: pay?.amount_refunded_cents ?? null,
        redeemed_at: g.redeemed_at, recipient_name: g.recipient_name, recipient_email: g.recipient_email, recipient_phone: g.recipient_phone,
        terms_version: g.terms_version, refunded_at: g.refunded_at, cancelled_at: g.cancelled_at, cancel_note: g.cancel_note,
        certificate_sent_at: g.certificate_sent_at, last_certificate_email: lastEmail.get(g.id) ?? null,
        link: redeemUrl(origin, g.token),
      }
    }),
  }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({})) as { action?: string; id?: string; note?: string }
  if (typeof body.id !== 'string') return NextResponse.json({ error: 'Missing gift.' }, { status: 400 })
  const gift = await giftById(body.id).catch(() => null)
  if (!gift) return NextResponse.json({ error: 'That gift was not found.' }, { status: 404 })

  if (body.action === 'resend') {
    if (gift.status !== 'purchased') {
      return NextResponse.json({ error: 'Only a gift that has not been claimed, refunded or cancelled can be resent.' }, { status: 409 })
    }
    const r = await sendCertificate(gift, siteOrigin(req.nextUrl.origin))
    if (r.status === 'sent') return NextResponse.json({ ok: true, message: `The certificate was emailed to ${process.env.VERCEL_ENV === 'production' ? gift.purchaser_email : 'the test inbox'}.` })
    return NextResponse.json({ error: r.status === 'skipped' ? `Not sent: ${r.error}` : 'The email could not be sent. Details are in the email log.' }, { status: 502 })
  }

  if (body.action === 'cancel') {
    const note = typeof body.note === 'string' ? body.note.trim().slice(0, 500) || null : null
    const ok = await cancelGift(gift.id, note)
    if (!ok) return NextResponse.json({ error: 'Only a gift that has not been claimed, refunded or cancelled can be cancelled.' }, { status: 409 })
    return NextResponse.json({ ok: true, message: 'Marked Cancelled. The gift link no longer works. Nothing was refunded in Stripe.' })
  }

  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
}
