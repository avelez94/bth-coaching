'use client'

import { useState } from 'react'
import type { AdminMe, ViewProps } from '../page'

// Your Account: who is signed in, and changing your own password.
// Changing it signs you out everywhere, then you sign in with the new one.
export default function AccountView({ me, onSignedOut }: ViewProps & { me: AdminMe; onSignedOut: (note: string) => void }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (next !== confirm) { setError('The two new passwords do not match.'); return }
    setBusy(true)
    const res = await fetch('/api/admin/password/change', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current, password: next, confirm }),
    })
    const d = await res.json().catch(() => ({}))
    setBusy(false)
    if (res.ok) {
      setCurrent(''); setNext(''); setConfirm('')
      onSignedOut('Your password was changed. Sign in with your new password.')
    } else setError(d.error || 'The password was not changed. Try again.')
  }

  return (
    <>
      <div className="main-topbar">
        <div>
          <div className="main-topbar-title">Your Account</div>
          <div className="main-topbar-sub">Your sign in details and password.</div>
        </div>
      </div>
      <div className="page-wrap">
        <div className="grid-2">
          <div className="card">
            <div className="eyebrow">Signed in as</div>
            <div className="kv">
              <span className="muted">Email</span><span>{me.email}</span>
              <span className="muted">Name</span><span>{me.name || ''}</span>
              <span className="muted">Role</span><span>{me.role === 'owner' ? 'Owner' : 'Developer'}</span>
            </div>
            <p className="card-sub" style={{ marginTop: 16 }}>
              {me.role === 'owner'
                ? 'As the Owner you control who else can sign in, under Users & Access. Never share your password: invite a Developer instead.'
                : 'You have Developer access, given by the site Owner. The Owner can remove it at any time.'}
            </p>
          </div>

          <form className="card" onSubmit={submit}>
            <div className="eyebrow">Change your password</div>
            {error && <div className="notice warn" role="alert">{error}</div>}
            <div className="field">
              <label className="field-label" htmlFor="cur">Current password</label>
              <input id="cur" className="field-input" type="password" autoComplete="current-password" value={current} onChange={e => setCurrent(e.target.value)} required />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="new">New password</label>
              <input id="new" className="field-input" type="password" autoComplete="new-password" value={next} onChange={e => setNext(e.target.value)} required minLength={12} />
              <div className="field-hint">At least 12 characters. A short phrase you will remember works well.</div>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="conf">New password again</label>
              <input id="conf" className="field-input" type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={12} />
            </div>
            <button className="save-btn" type="submit" disabled={busy || !current || !next || !confirm}>{busy ? 'Saving…' : 'Change password'}</button>
            <p className="field-hint" style={{ marginTop: 12 }}>You will be signed out on every device and asked to sign in again. A confirmation email goes to {me.email}.</p>
          </form>
        </div>
      </div>
    </>
  )
}
