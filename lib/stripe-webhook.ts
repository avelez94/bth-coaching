import { createHmac, timingSafeEqual } from 'node:crypto'

// Verifies the Stripe-Signature header exactly as Stripe documents it:
// HMAC SHA-256 of "<timestamp>.<raw body>" with the endpoint's signing
// secret (whsec_...), compared in constant time, with a 5 minute window
// against replays. Only the signing secret is needed, not an API key.
export function verifyStripeSignature(rawBody: string, header: string | null, secret: string, toleranceSec = 300, now = Date.now()): boolean {
  if (!header || !secret) return false
  const parts = header.split(',').map(p => p.trim())
  const t = parts.find(p => p.startsWith('t='))?.slice(2)
  const sigs = parts.filter(p => p.startsWith('v1=')).map(p => p.slice(3))
  if (!t || !/^\d+$/.test(t) || sigs.length === 0) return false
  if (Math.abs(now / 1000 - Number(t)) > toleranceSec) return false
  const expected = createHmac('sha256', secret).update(`${t}.${rawBody}`, 'utf8').digest()
  return sigs.some(s => {
    if (!/^[0-9a-f]+$/i.test(s)) return false
    const got = Buffer.from(s, 'hex')
    return got.length === expected.length && timingSafeEqual(got, expected)
  })
}

/** The fields of a Checkout Session this site uses */
export interface CheckoutSession {
  id: string
  client_reference_id: string | null
  customer_details?: { email?: string | null; name?: string | null } | null
  customer_email?: string | null
  amount_total: number | null
  currency: string | null
  payment_status: 'paid' | 'unpaid' | 'no_payment_required'
  mode: 'payment' | 'subscription' | 'setup'
  livemode: boolean
}

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
