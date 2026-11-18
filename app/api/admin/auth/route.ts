import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { db } from '@/lib/site-data'
import {
  adminFromRequest, attempts, audit, checkPassword, clearSessionCookie, clientIp, hashPassword,
  normalizeEmail, recordAttempt, setSessionCookie, type AdminUser,
} from '@/lib/admin-auth'

// Too many failed sign ins in 15 minutes pauses sign in for that email
// address or network for the rest of the window.
const WINDOW_MIN = 15
const MAX_PER_EMAIL = 5
const MAX_PER_IP = 20

const sameSecret = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

// POST /api/admin/auth  { email, password }: signs in and sets the session cookie
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const email = normalizeEmail(body.email)
    const password = typeof body.password === 'string' ? body.password : ''
    const ip = clientIp(req)

    if ((await attempts('login', email, WINDOW_MIN)) >= MAX_PER_EMAIL || (await attempts('login-ip', ip, WINDOW_MIN)) >= MAX_PER_IP) {
      return NextResponse.json({ error: 'Too many attempts. Wait 15 minutes, or use Forgot password.' }, { status: 429 })
    }

    const { data } = email
      ? await db().from('admin_users').select('id, email, name, role, status, session_version, password_hash').eq('email', email).maybeSingle()
      : { data: null }
    const row = data as (AdminUser & { password_hash: string | null }) | null
    const active = row?.status === 'active' ? row : null

    let ok = Boolean(password) && await checkPassword(password, active?.password_hash ?? null)

    // One time move from the old shared Admin password: the Owner account
    // has no stored password yet, so the existing password is accepted once
    // and saved as the Owner's own (hashed). After that it is never read.
    const legacy = process.env.ADMIN_PASSWORD
    if (!ok && active && active.role === 'owner' && !active.password_hash && legacy && password && sameSecret(password, legacy)) {
      await db().from('admin_users').update({ password_hash: await hashPassword(password), password_changed_at: new Date().toISOString() }).eq('id', active.id)
      await audit('password_set_from_previous', active, active.email)
      ok = true
    }

    if (!ok || !active) {
      await recordAttempt('login', email || '(blank)')
      await recordAttempt('login-ip', ip)
      return NextResponse.json({ error: 'That email and password do not match an Admin account.' }, { status: 401 })
    }

    await db().from('admin_users').update({ last_login_at: new Date().toISOString() }).eq('id', active.id)
    await audit('signed_in', active)
    const res = NextResponse.json({ success: true })
    setSessionCookie(res, active)
    return res
  } catch (e) {
    console.error('[admin-auth] sign in failed:', e instanceof Error ? e.message : 'unknown error')
    return NextResponse.json({ error: 'Sign in is unavailable right now.' }, { status: 500 })
  }
}

// GET /api/admin/auth: who is signed in (no secrets), or 401
export async function GET(req: NextRequest) {
  const user = await adminFromRequest(req)
  if (!user) return NextResponse.json({ valid: false }, { status: 401 })
  return NextResponse.json({ valid: true, user: { email: user.email, name: user.name, role: user.role } })
}

// DELETE /api/admin/auth: signs out
export async function DELETE() {
  const res = NextResponse.json({ success: true })
  clearSessionCookie(res)
  return res
}
