import { NextRequest, NextResponse } from 'next/server'
import { attempts, audit, clientIp, consumeToken, passwordProblem, peekToken, recordAttempt, setPassword } from '@/lib/admin-auth'
import { sendPasswordChangedNotice } from '@/lib/admin-accounts'

const INVALID = 'This reset link is not valid anymore. It may have expired or already been used. Ask for a new one from the sign in page.'

// POST /api/admin/password/reset  { token, password, confirm }
// The link's token works once. A new password ends every session and
// every other reset link for the account. The person then signs in.
export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  if ((await attempts('token-ip', ip, 15)) >= 20) {
    return NextResponse.json({ error: 'Too many attempts. Wait 15 minutes and try again.' }, { status: 429 })
  }
  const body = await req.json().catch(() => ({}))

  // Check the link before the password, so a weak password does not use it up
  const preview = await peekToken(body.token, 'reset')
  if (!preview || preview.status !== 'active') {
    await recordAttempt('token-ip', ip)
    return NextResponse.json({ error: INVALID }, { status: 400 })
  }
  const problem = passwordProblem(body.password, body.confirm, preview.email)
  if (problem) return NextResponse.json({ error: problem }, { status: 400 })

  const user = await consumeToken(body.token, 'reset')
  if (!user || user.status !== 'active') return NextResponse.json({ error: INVALID }, { status: 400 })

  await setPassword(user, body.password)
  await audit('password_reset', user, user.email)
  await sendPasswordChangedNotice(user, 'reset')
  return NextResponse.json({ success: true })
}
