import { randomBytes, randomInt } from 'node:crypto'

// ============================================================
// Sprint gift tokens and codes. Pure functions, no database.
//
// token: 32 bytes from the operating system's secure random source,
//        base64url (43 characters, 256 bits). This is what the
//        redemption link carries.
// code:  SPRINT-XXXX-XXXX-XXXX, 12 characters from a 31 character
//        alphabet with no look-alikes (no 0/O, 1/I/L), drawn with
//        crypto.randomInt. About 59 bits: printed on the certificate
//        so it can be typed in by hand, and far too many combinations
//        to guess. Neither is derived from the other or from any ID.
// ============================================================

export const CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
export const CODE_PATTERN = /^SPRINT-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/
export const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/

export function generateToken(): string {
  return randomBytes(32).toString('base64url')
}

export function generateCode(): string {
  const pick = () => Array.from({ length: 4 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join('')
  return `SPRINT-${pick()}-${pick()}-${pick()}`
}

/** Accepts what a person might type ("sprint 8f4k 2qx7 m9pd", missing dashes) */
export function normalizeCode(input: string): string | null {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const body = raw.startsWith('SPRINT') ? raw.slice(6) : raw
  if (body.length !== 12) return null
  const code = `SPRINT-${body.slice(0, 4)}-${body.slice(4, 8)}-${body.slice(8)}`
  return CODE_PATTERN.test(code) ? code : null
}

export const isToken = (t: unknown): t is string => typeof t === 'string' && TOKEN_PATTERN.test(t)

export type GiftStatus = 'purchased' | 'redeemed' | 'refunded' | 'cancelled'

/** Plain-language labels for John */
export const GIFT_STATUS_LABEL: Record<GiftStatus, string> = {
  purchased: 'Purchased',
  redeemed: 'Redeemed',
  refunded: 'Refunded',
  cancelled: 'Cancelled',
}

/** What a recipient is told, by status. Never includes anyone's details. */
export const REDEEM_MESSAGE = {
  invalid: 'This gift link is not valid.',
  redeemed: 'This gift has already been redeemed.',
  refunded: 'This gift was refunded, so it can no longer be redeemed.',
  cancelled: 'This gift is no longer active, so it can no longer be redeemed.',
  closed: 'Registration for Sprint gifts has closed, so this gift can no longer be redeemed.',
} as const

export const redeemPath = (token: string) => `/sprint/redeem?token=${encodeURIComponent(token)}`
