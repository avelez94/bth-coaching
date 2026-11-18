import { NextRequest, NextResponse } from 'next/server'
import { attempts, clientIp, peekToken, recordAttempt } from '@/lib/admin-auth'

// POST /api/admin/invite/check  { token }: who a pending invitation is for,
// without using it. Shows only the invited email address.
export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  if ((await attempts('token-ip', ip, 15)) >= 20) return NextResponse.json({ valid: false }, { status: 429 })
  const body = await req.json().catch(() => ({}))
  const user = await peekToken(body.token, 'invite')
  if (!user || user.status !== 'invited') {
    await recordAttempt('token-ip', ip)
    return NextResponse.json({ valid: false })
  }
  return NextResponse.json({ valid: true, email: user.email, name: user.name })
}
