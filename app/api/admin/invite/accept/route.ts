import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/site-data'
import {
  attempts, audit, clientIp, consumeToken, hashPassword, passwordProblem, peekToken, recordAttempt, setSessionCookie, type AdminUser,
} from '@/lib/admin-auth'
import { notifyOwners } from '@/lib/admin-accounts'

const INVALID = 'This invitation is not valid anymore. It may have expired, been used, or been cancelled. Ask the site Owner for a new one.'

// POST /api/admin/invite/accept  { token, name?, password, confirm }
// The invited Developer sets their own password. The link works once.
// Their role is always Developer; nothing here can create an Owner.
export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  if ((await attempts('token-ip', ip, 15)) >= 20) {
    return NextResponse.json({ error: 'Too many attempts. Wait 15 minutes and try again.' }, { status: 429 })
  }
  const body = await req.json().catch(() => ({}))

  const preview = await peekToken(body.token, 'invite')
  if (!preview || preview.status !== 'invited') {
    await recordAttempt('token-ip', ip)
    return NextResponse.json({ error: INVALID }, { status: 400 })
  }
  const problem = passwordProblem(body.password, body.confirm, preview.email)
  if (problem) return NextResponse.json({ error: problem }, { status: 400 })

  const invited = await consumeToken(body.token, 'invite')
  if (!invited || invited.status !== 'invited' || invited.role !== 'developer') return NextResponse.json({ error: INVALID }, { status: 400 })

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 80) || invited.name : invited.name
  const { data, error } = await db().from('admin_users').update({
    status: 'active', name, password_hash: await hashPassword(body.password),
    password_changed_at: new Date().toISOString(), last_login_at: new Date().toISOString(),
  }).eq('id', invited.id).eq('status', 'invited').select('id, email, name, role, status, session_version').single()
  if (error || !data) return NextResponse.json({ error: INVALID }, { status: 400 })

  const user = data as AdminUser
  await audit('invitation_accepted', user, user.email)
  await notifyOwners(`${user.name ? `${user.name} (${user.email})` : user.email} accepted your invitation and now has Developer access to the website Admin.`)
  const res = NextResponse.json({ success: true })
  setSessionCookie(res, user)
  return res
}
