import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { db } from '@/lib/site-data'

// GET /api/admin/sprint-purchases: every Sprint payment Stripe has confirmed
export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await db().from('stripe_payments')
    .select('id, created_at, kind, customer_name, customer_email, amount_total_cents, payment_status, livemode, stripe_session_id')
    .in('kind', ['sprint_self', 'sprint_gift'])
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: 'Could not load purchases.' }, { status: 500 })
  return NextResponse.json({ purchases: data ?? [] })
}
