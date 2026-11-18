import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/site-data'
import { attempts, audit, clientIp, looksLikeEmail, normalizeEmail, recordAttempt, type AdminUser } from '@/lib/admin-auth'
import { sendResetLink } from '@/lib/admin-accounts'

// POST /api/admin/password/forgot  { email }
// Always gives the same answer, so it never reveals which addresses have
// an account. A link is emailed only to an active account's own address,
// and only a few times an hour.
const SAME_ANSWER = { success: true, message: 'If that email belongs to an Admin account, a reset link is on its way. It expires in 30 minutes.' }

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const email = normalizeEmail(body.email)
  if (!looksLikeEmail(email)) return NextResponse.json({ error: 'Enter the email address you sign in with.' }, { status: 400 })

  const ip = clientIp(req)
  const limited = (await attempts('reset', email, 60)) >= 3 || (await attempts('reset-ip', ip, 60)) >= 10
  await recordAttempt('reset', email)
  await recordAttempt('reset-ip', ip)
  if (limited) return NextResponse.json(SAME_ANSWER)

  try {
    const { data } = await db().from('admin_users').select('id, email, name, role, status, session_version').eq('email', email).maybeSingle()
    const user = data as AdminUser | null
    if (user && user.status === 'active') {
      await sendResetLink(user)
      await audit('password_reset_requested', null, user.email)
    }
  } catch (e) {
    console.error('[admin-auth] reset request failed:', e instanceof Error ? e.message : 'unknown error')
  }
  return NextResponse.json(SAME_ANSWER)
}
