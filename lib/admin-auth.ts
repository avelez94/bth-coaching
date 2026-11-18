import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { createHash, createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'crypto'
import { promisify } from 'util'
import { db } from './site-data'

// ============================================================
// Admin accounts and sessions.
//
// Each person has their own account: one Owner (John) and, when he
// chooses, Developers he invites. Passwords are stored only as scrypt
// hashes. The session is an HttpOnly cookie signed with
// ADMIN_SESSION_SECRET that names the account and its session version;
// every request rechecks the account in the database, so a password
// change, reset or revoked access ends that account's sessions at once.
//
// Nothing in this file logs, returns or stores a password or a token.
// ============================================================

export type AdminRole = 'owner' | 'developer'
export interface AdminUser {
  id: string
  email: string
  name: string | null
  role: AdminRole
  status: 'invited' | 'active' | 'revoked'
  session_version: number
}

export const COOKIE_NAME = 'bth_admin_session'
const SESSION_TTL_MS = 8 * 60 * 60 * 1000
const USER_COLUMNS = 'id, email, name, role, status, session_version'

// ---------- Session cookie ----------

function sessionSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET?.trim()
  if (!s) throw new Error('ADMIN_SESSION_SECRET is not set')
  return s
}

const b64 = (s: string) => Buffer.from(s).toString('base64url')
const sign = (payload: string) => createHmac('sha256', sessionSecret()).update(`bth-admin:${payload}`).digest('base64url')

function issueSession(user: AdminUser): string {
  const payload = b64(JSON.stringify({ u: user.id, v: user.session_version, i: Date.now() }))
  return `${payload}.${sign(payload)}`
}

function readSession(token: string): { u: string; v: number } | null {
  try {
    const [payload, sig] = token.split('.')
    if (!payload || !sig) return null
    const expected = Buffer.from(sign(payload))
    const given = Buffer.from(sig)
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (typeof data.u !== 'string' || typeof data.v !== 'number' || typeof data.i !== 'number') return null
    if (Date.now() - data.i > SESSION_TTL_MS || data.i > Date.now() + 60_000) return null
    return { u: data.u, v: data.v }
  } catch { return null }
}

/** The signed in account for a cookie value, or null */
export async function sessionUser(cookieValue: string | undefined): Promise<AdminUser | null> {
  const s = readSession(cookieValue ?? '')
  if (!s) return null
  const { data } = await db().from('admin_users').select(USER_COLUMNS).eq('id', s.u).maybeSingle()
  const user = data as AdminUser | null
  if (!user || user.status !== 'active' || user.session_version !== s.v) return null
  return user
}

/** The signed in account for an API request, or null */
export async function adminFromRequest(req: NextRequest): Promise<AdminUser | null> {
  return sessionUser(req.cookies.get(COOKIE_NAME)?.value)
}

/** True when any active Owner or Developer is signed in */
export async function verifyAdminToken(req: NextRequest): Promise<boolean> {
  return Boolean(await adminFromRequest(req))
}

/** For Owner only routes: the Owner, or a ready 401/403 response */
export async function requireOwner(req: NextRequest): Promise<AdminUser | NextResponse> {
  const user = await adminFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'owner') return NextResponse.json({ error: 'Only the Owner can do this.' }, { status: 403 })
  return user
}

const cookieOptions = (maxAge: number) => ({
  httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, maxAge, path: '/',
})
export function setSessionCookie(res: NextResponse, user: AdminUser) {
  res.cookies.set(COOKIE_NAME, issueSession(user), cookieOptions(SESSION_TTL_MS / 1000))
}
export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, '', cookieOptions(0))
}

// ---------- Passwords ----------

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number, opts: object) => Promise<Buffer>
const SCRYPT = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const key = await scrypt(password, salt, 32, SCRYPT)
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('base64')}$${key.toString('base64')}`
}

export async function checkPassword(password: string, stored: string | null): Promise<boolean> {
  // A missing account still costs one hash, so timing does not reveal it
  const parts = (stored ?? '').split('$')
  const valid = parts.length === 6 && parts[0] === 'scrypt'
  const salt = valid ? Buffer.from(parts[4], 'base64') : randomBytes(16)
  const opts = valid ? { N: Number(parts[1]), r: Number(parts[2]), p: Number(parts[3]), maxmem: SCRYPT.maxmem } : SCRYPT
  const key = await scrypt(password, salt, 32, opts)
  if (!valid) return false
  const expected = Buffer.from(parts[5], 'base64')
  return expected.length === key.length && timingSafeEqual(expected, key)
}

const COMMON = new Set(['password1234', 'password12345', '123456789012', 'qwertyuiop12', 'beyondthehorizon', 'mccrackencoaching', 'letmein12345', 'administrator', 'changeme1234'])

/** Plain-language reason a new password is not acceptable, or null */
export function passwordProblem(password: unknown, confirm: unknown, email?: string): string | null {
  if (typeof password !== 'string' || !password) return 'Enter a new password.'
  if (password !== confirm) return 'The two new passwords do not match.'
  if (password.length < 12) return 'Use at least 12 characters.'
  if (password.length > 128) return 'Use 128 characters or fewer.'
  if (/^(.)\1+$/.test(password)) return 'Choose a password that is not one repeated character.'
  const lower = password.toLowerCase()
  if (COMMON.has(lower.replace(/[^a-z0-9]/g, ''))) return 'That password is too easy to guess. Choose another.'
  if (email && lower.includes(email.split('@')[0].toLowerCase())) return 'Choose a password that does not contain your email name.'
  return null
}

// ---------- Tokens (password reset and invitations) ----------

export const sha256 = (v: string) => createHash('sha256').update(v).digest('hex')

/** Creates a single use token, stores only its hash, and returns the raw token for the email link */
export async function createToken(userId: string, purpose: 'reset' | 'invite', ttlMinutes: number): Promise<string> {
  // Any earlier unused token for the same purpose stops working
  await db().from('admin_tokens').update({ used_at: new Date().toISOString() })
    .eq('user_id', userId).eq('purpose', purpose).is('used_at', null)
  const raw = randomBytes(32).toString('base64url')
  const { error } = await db().from('admin_tokens').insert({
    user_id: userId, purpose, token_hash: sha256(raw),
    expires_at: new Date(Date.now() + ttlMinutes * 60_000).toISOString(),
  })
  if (error) throw new Error('Could not create the link.')
  return raw
}

/** Looks a token up without using it (to show who an invitation is for) */
export async function peekToken(raw: unknown, purpose: 'reset' | 'invite'): Promise<AdminUser | null> {
  if (typeof raw !== 'string' || raw.length < 20 || raw.length > 100) return null
  const { data } = await db().from('admin_tokens').select('user_id')
    .eq('token_hash', sha256(raw)).eq('purpose', purpose).is('used_at', null)
    .gt('expires_at', new Date().toISOString()).maybeSingle()
  if (!data) return null
  const { data: user } = await db().from('admin_users').select(USER_COLUMNS).eq('id', data.user_id).maybeSingle()
  return (user as AdminUser | null) ?? null
}

/** Uses a token exactly once. Returns its account, or null if invalid, expired or already used. */
export async function consumeToken(raw: unknown, purpose: 'reset' | 'invite'): Promise<AdminUser | null> {
  if (typeof raw !== 'string' || raw.length < 20 || raw.length > 100) return null
  // One conditional update: two simultaneous uses cannot both succeed
  const { data } = await db().from('admin_tokens').update({ used_at: new Date().toISOString() })
    .eq('token_hash', sha256(raw)).eq('purpose', purpose).is('used_at', null)
    .gt('expires_at', new Date().toISOString()).select('user_id')
  const row = data?.[0]
  if (!row) return null
  const { data: user } = await db().from('admin_users').select(USER_COLUMNS).eq('id', row.user_id).maybeSingle()
  return (user as AdminUser | null) ?? null
}

/** Sets a new password and ends every session and outstanding reset link for the account */
export async function setPassword(user: AdminUser, password: string, extra: Record<string, unknown> = {}) {
  const { error } = await db().from('admin_users').update({
    password_hash: await hashPassword(password),
    session_version: user.session_version + 1,
    password_changed_at: new Date().toISOString(),
    ...extra,
  }).eq('id', user.id)
  if (error) throw new Error('Could not save the new password.')
  await db().from('admin_tokens').update({ used_at: new Date().toISOString() })
    .eq('user_id', user.id).eq('purpose', 'reset').is('used_at', null)
}

// ---------- Rate limiting ----------

export function clientIp(req: NextRequest): string {
  return (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
}

/** How many attempts of this kind for this key in the window */
export async function attempts(kind: string, key: string, windowMinutes: number): Promise<number> {
  const { count } = await db().from('admin_auth_attempts').select('id', { count: 'exact', head: true })
    .eq('kind', kind).eq('key_hash', sha256(key.toLowerCase()))
    .gt('created_at', new Date(Date.now() - windowMinutes * 60_000).toISOString())
  return count ?? 0
}

export async function recordAttempt(kind: string, key: string) {
  await db().from('admin_auth_attempts').insert({ kind, key_hash: sha256(key.toLowerCase()) })
  // Keep the table small: anything older than a day no longer matters
  if (Math.random() < 0.05) {
    await db().from('admin_auth_attempts').delete().lt('created_at', new Date(Date.now() - 86_400_000).toISOString())
  }
}

// ---------- Access history ----------

export type AuditAction =
  | 'signed_in' | 'password_changed' | 'password_reset' | 'password_reset_requested' | 'password_set_from_previous'
  | 'developer_invited' | 'invitation_resent' | 'invitation_accepted' | 'access_revoked'

export async function audit(action: AuditAction, actor: Pick<AdminUser, 'id' | 'email'> | null, targetEmail?: string | null) {
  try {
    await db().from('admin_audit_log').insert({
      action, actor_id: actor?.id ?? null, actor_email: actor?.email ?? null, target_email: targetEmail ?? null,
    })
  } catch { /* history is best effort and never blocks the action */ }
}

export const normalizeEmail = (v: unknown) => (typeof v === 'string' ? v.trim().toLowerCase() : '')
export const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254
