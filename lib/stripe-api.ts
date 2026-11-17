import 'server-only'

// ============================================================
// Minimal server side Stripe API client for the one thing the site
// asks Stripe to do: set a monthly installment plan to stop after its
// last payment. Uses STRIPE_RESTRICTED_KEY (a restricted key that can
// only work with subscriptions). Never imported by client code.
// ============================================================

/** Pinned so responses always have the shape this code expects. Same version as the webhook endpoint. */
export const STRIPE_API_VERSION = '2026-10-28.endive'

export class StripeApiError extends Error {
  constructor(message: string, readonly status: number, readonly code?: string, readonly type?: string) { super(message) }
}

export interface StripeClient {
  get<T>(path: string, query?: Record<string, string | string[]>): Promise<T>
  post<T>(path: string, body: Record<string, unknown>, opts?: { idempotencyKey?: string }): Promise<T>
}

/** Stripe form encoding: a[b][0][c]=v */
export function formEncode(body: Record<string, unknown>): string {
  const out: string[] = []
  const walk = (key: string, v: unknown) => {
    if (v === undefined) return
    if (v === null) { out.push(`${encodeURIComponent(key)}=`); return }
    if (Array.isArray(v)) {
      if (v.length === 0) { out.push(`${encodeURIComponent(key)}=`); return }
      v.forEach((x, i) => walk(`${key}[${i}]`, x)); return
    }
    if (typeof v === 'object') {
      const entries = Object.entries(v as Record<string, unknown>)
      if (entries.length === 0) { out.push(`${encodeURIComponent(key)}=`); return }
      for (const [k, x] of entries) walk(`${key}[${k}]`, x)
      return
    }
    out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`)
  }
  for (const [k, v] of Object.entries(body)) walk(k, v)
  return out.join('&')
}

export function stripeKey(): string | null {
  const k = process.env.STRIPE_RESTRICTED_KEY?.trim()
  return k ? k : null
}

export function createStripeClient(key: string, fetchImpl: typeof fetch = fetch): StripeClient {
  const headers = (extra?: Record<string, string>) => ({
    Authorization: `Bearer ${key}`,
    'Stripe-Version': STRIPE_API_VERSION,
    ...extra,
  })
  async function handle<T>(res: Response): Promise<T> {
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const e = (data as { error?: { message?: string; code?: string; type?: string } }).error ?? {}
      throw new StripeApiError(e.message ?? `Stripe request failed (${res.status})`, res.status, e.code, e.type)
    }
    return data as T
  }
  return {
    async get<T>(path: string, query?: Record<string, string | string[]>) {
      const qs = query ? formEncode(query) : ''
      const res = await fetchImpl(`https://api.stripe.com${path}${qs ? `?${qs}` : ''}`, { method: 'GET', headers: headers(), cache: 'no-store' })
      return handle<T>(res)
    },
    async post<T>(path: string, body: Record<string, unknown>, opts?: { idempotencyKey?: string }) {
      const res = await fetchImpl(`https://api.stripe.com${path}`, {
        method: 'POST',
        headers: headers({ 'Content-Type': 'application/x-www-form-urlencoded', ...(opts?.idempotencyKey ? { 'Idempotency-Key': opts.idempotencyKey } : {}) }),
        body: formEncode(body),
        cache: 'no-store',
      })
      return handle<T>(res)
    },
  }
}
