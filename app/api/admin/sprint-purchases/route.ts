import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { db } from '@/lib/site-data'

// GET /api/admin/sprint-purchases
//   purchases:     every Sprint payment Stripe has confirmed, with the
//                  participant's registration for a self purchase
//   awaiting:      people who registered on /sprint/register but whose
//                  payment Stripe has not confirmed (not enrolled)
export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [{ data, error }, { data: regs, error: regErr }] = await Promise.all([
    db().from('stripe_payments')
      .select('id, created_at, kind, customer_name, customer_email, amount_total_cents, payment_status, livemode, stripe_session_id, amount_refunded_cents, refunded_at')
      .in('kind', ['sprint_self', 'sprint_gift'])
      .order('created_at', { ascending: false }),
    db().from('sprint_registrations')
      .select('id, created_at, name, email, phone, status, stripe_session_id, terms_version, terms_accepted_at')
      .order('created_at', { ascending: false }),
  ])
  if (error || regErr) return NextResponse.json({ error: 'Could not load purchases.' }, { status: 500 })
  const bySession = new Map((regs ?? []).filter(r => r.stripe_session_id).map(r => [r.stripe_session_id, r]))
  const purchases = (data ?? []).map(p => {
    const r = bySession.get(p.stripe_session_id)
    return { ...p, participant: r ? { name: r.name, email: r.email, phone: r.phone, terms_version: r.terms_version } : null }
  })
  const awaiting = (regs ?? []).filter(r => r.status !== 'paid').map(r => ({ id: r.id, created_at: r.created_at, name: r.name, email: r.email, phone: r.phone, status: r.status }))
  return NextResponse.json({ purchases, awaiting })
}
