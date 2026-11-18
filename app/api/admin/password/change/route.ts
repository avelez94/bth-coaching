import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/site-data'
import {
  adminFromRequest, attempts, audit, checkPassword, clearSessionCookie, passwordProblem, recordAttempt, setPassword,
} from '@/lib/admin-auth'
import { sendPasswordChangedNotice } from '@/lib/admin-accounts'

// POST /api/admin/password/change  { current, password, confirm }
// The signed in person changes their own password. Every session for the
// account ends, including this one, so they sign in again with the new
// password. No one can change another person's password here.
export async function POST(req: NextRequest) {
  const user = await adminFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((await attempts('change', user.id, 15)) >= 5) {
    return NextResponse.json({ error: 'Too many attempts. Wait 15 minutes and try again.' }, { status: 429 })
  }

  const body = await req.json().catch(() => ({}))
  const { data } = await db().from('admin_users').select('password_hash').eq('id', user.id).single()
  if (typeof body.current !== 'string' || !(await checkPassword(body.current, data?.password_hash ?? null))) {
    await recordAttempt('change', user.id)
    return NextResponse.json({ error: 'Your current password is not correct.' }, { status: 400 })
  }
  const problem = passwordProblem(body.password, body.confirm, user.email)
  if (problem) return NextResponse.json({ error: problem }, { status: 400 })
  if (body.password === body.current) return NextResponse.json({ error: 'Choose a password different from your current one.' }, { status: 400 })

  await setPassword(user, body.password)
  await audit('password_changed', user, user.email)
  await sendPasswordChangedNotice(user, 'changed')
  const res = NextResponse.json({ success: true, signedOut: true })
  clearSessionCookie(res)
  return res
}
