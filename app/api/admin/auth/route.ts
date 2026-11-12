import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

// Session tokens are HMAC-SHA256 signatures over "bth-admin:<issuedAt>".
// They are valid for SESSION_TTL_MS milliseconds.
// The password itself is never sent back to the client or stored client-side.
const SESSION_TTL_MS = 8 * 60 * 60 * 1000 // 8 hours

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

// Returns true when the token is structurally valid and within TTL.
export function verifyToken(token: string): boolean {
  try {
    const dot = token.indexOf('.')
    if (dot === -1) return false
    const issuedAt = parseInt(token.slice(0, dot), 10)
    if (isNaN(issuedAt)) return false
    if (Date.now() - issuedAt > SESSION_TTL_MS) return false
    const expected = issueToken(issuedAt)
    // Constant-time comparison to prevent timing attacks
    const a = Buffer.from(expected)
    const b = Buffer.from(token.padEnd(expected.length, '\0').slice(0, expected.length))
    return a.length === b.length && timingSafeEqual(a, b)
  } catch {
    return false
  }
}

// POST /api/admin/auth — verify password, return session token
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }
    const token = issueToken(Date.now())
    return NextResponse.json({ success: true, token })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET /api/admin/auth — verify an existing session token
export async function GET(req: NextRequest) {
  const token = req.headers.get('x-admin-token') || ''
  if (verifyToken(token)) {
    return NextResponse.json({ valid: true })
  }
  return NextResponse.json({ valid: false }, { status: 401 })
}
