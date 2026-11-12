import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

// Session tokens are HMAC-SHA256 signatures over "bth-admin:<issuedAt>".
// Valid for SESSION_TTL_MS milliseconds (8 hours).
// The token is stored only in an HttpOnly, Secure, SameSite=Strict cookie —
// never in localStorage, sessionStorage, or returned to client JS.
const SESSION_TTL_MS = 8 * 60 * 60 * 1000 // 8 hours
const COOKIE_NAME = 'bth_admin_session'

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD
  if (!s) throw new Error('ADMIN_SESSION_SECRET is not set')
  return s
}

export function issueToken(issuedAt: number): string {
  const payload = `bth-admin:${issuedAt}`
  const sig = createHmac('sha256', secret()).update(payload).digest('hex')
  return `${issuedAt}.${sig}`
}

export function verifyToken(token: string): boolean {
  try {
    const dot = token.indexOf('.')
    if (dot === -1) return false
    const issuedAt = parseInt(token.slice(0, dot), 10)
    if (isNaN(issuedAt)) return false
    if (Date.now() - issuedAt > SESSION_TTL_MS) return false
    const expected = issueToken(issuedAt)
    // Constant-time comparison — prevents timing attacks
    const a = Buffer.from(expected)
    const b = Buffer.from(token.padEnd(expected.length, '\0').slice(0, expected.length))
    return a.length === b.length && timingSafeEqual(a, b)
  } catch { return false }
}

// POST /api/admin/auth
// Verifies the admin password and sets an HttpOnly session cookie.
// The token is never returned in the response body — the browser holds it.
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }
    const token = issueToken(Date.now())
    const response = NextResponse.json({ success: true })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: SESSION_TTL_MS / 1000, // seconds
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET /api/admin/auth
// Checks whether the current session cookie is still valid.
// Used by the admin page on load to decide if the session is still alive.
export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value || ''
  if (verifyToken(token)) {
    return NextResponse.json({ valid: true })
  }
  return NextResponse.json({ valid: false }, { status: 401 })
}

// DELETE /api/admin/auth
// Signs out by clearing the session cookie server-side.
export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })
  return response
}
