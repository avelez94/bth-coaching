'use client'

import { useState } from 'react'
import type { SprintTerms } from '@/lib/sprint-terms'

// Registration for someone joining the Sprint themselves. The server
// re-checks everything and returns the Stripe link for this registration.
export default function RegisterForm({ terms }: { terms: SprintTerms | null }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true); setError(null)
    try {
      const res = await fetch('/api/sprint/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'), email: f.get('email'), phone: f.get('phone'),
          ...(terms ? { acceptTerms: f.get('acceptTerms') === 'on' } : {}),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && typeof data.url === 'string') { window.location.assign(data.url); return }
      setError(data.error || 'Something went wrong. Please try again.')
    } catch {
      setError('Something went wrong. Please check your connection and try again.')
    }
    setBusy(false)
  }

  return (
    <form className="rd-form" onSubmit={submit}>
      {error && <p className="rd-error" role="alert">{error}</p>}
      <div className="rd-field">
        <label htmlFor="name">Full name</label>
        <input id="name" name="name" required minLength={2} maxLength={120} autoComplete="name" />
      </div>
      <div className="rd-field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" inputMode="email" />
      </div>
      <div className="rd-field">
        <label htmlFor="phone">Phone <span className="rd-optional">(optional)</span></label>
        <input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" inputMode="tel" />
      </div>

      {terms && (
        <div className="rd-terms">
          <h3 className="rd-h3">{terms.title}</h3>
          <div className="rd-terms-text">{terms.text}</div>
          <label className="rd-check">
            <input type="checkbox" name="acceptTerms" required /> {terms.acceptLabel}
          </label>
        </div>
      )}

      <button type="submit" className="btn btn-gold rd-submit" disabled={busy}>
        {busy ? 'One moment…' : 'Continue to payment'}
      </button>
    </form>
  )
}
