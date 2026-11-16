'use client'

import { useState, type ReactNode } from 'react'
import type { SprintTerms } from '@/lib/sprint-terms'

// The recipient's registration. The server re-checks everything.
// children: the gift's valid notice and details, shown only while the form is.
export default function RedeemForm({ token, terms, children }: { token: string; terms: SprintTerms | null; children: ReactNode }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [blocked, setBlocked] = useState(false)
  const [done, setDone] = useState<string | null>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true); setError(null)
    try {
      const res = await fetch('/api/sprint/redeem', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token, name: f.get('name'), email: f.get('email'), phone: f.get('phone'),
          ...(terms ? { acceptTerms: f.get('acceptTerms') === 'on' } : {}),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) { setDone(String(f.get('email') ?? '')); window.scrollTo(0, 0); return }
      setError(data.error || 'Something went wrong. Please try again.')
      if (data.state) { setBlocked(true); window.scrollTo(0, 0) }
    } catch {
      setError('Something went wrong. Please check your connection and try again.')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="rd-success" role="status">
        <h2 className="rd-h2">You&rsquo;re registered for the 8 Pillar Sprint.</h2>
        <p>Your seat is claimed. A confirmation is on its way to <strong>{done}</strong>, and John will be in touch before Week 1 with your welcome details and the self-assessment.</p>
      </div>
    )
  }

  if (blocked) return <p className="rd-status rd-status-error" role="alert">{error}</p>

  return (
    <>
    {children}
    <form className="rd-form" onSubmit={submit} noValidate={false}>
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
        {busy ? 'Claiming your seat…' : 'Claim my seat'}
      </button>
    </form>
    </>
  )
}
