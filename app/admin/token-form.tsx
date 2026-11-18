'use client'

import { useEffect, useState } from 'react'
import { ADMIN_STYLES } from './admin-styles'

// Shared page for the two emailed links: choosing a new password after a
// reset, and accepting a Developer invitation. The token arrives after
// "#" so it never reaches a server log; it is read once, removed from the
// address bar, and sent only in the body of the final request.
export default function TokenForm({ kind }: { kind: 'reset' | 'invite' }) {
  const [token, setToken] = useState<string | null>(null)
  const [invitedEmail, setInvitedEmail] = useState<string | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'invalid' | 'done'>('loading')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const t = new URLSearchParams(window.location.hash.slice(1)).get('token')
    window.history.replaceState(null, '', window.location.pathname)
    if (!t) { setState('invalid'); return }
    setToken(t)
    if (kind === 'reset') { setState('ready'); return }
    fetch('/api/admin/invite/check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: t }) })
      .then(r => r.json()).then(d => {
        if (d.valid) { setInvitedEmail(d.email); setName(d.name || ''); setState('ready') } else setState('invalid')
      }).catch(() => setState('invalid'))
  }, [kind])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('The two passwords do not match.'); return }
    setBusy(true)
    const res = await fetch(kind === 'reset' ? '/api/admin/password/reset' : '/api/admin/invite/accept', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password, confirm, ...(kind === 'invite' ? { name } : {}) }),
    })
    const d = await res.json().catch(() => ({}))
    setBusy(false)
    if (res.ok) { setPassword(''); setConfirm(''); setToken(null); setState('done') } else setError(d.error || 'That did not work. Try again.')
  }

  const title = kind === 'reset' ? 'Choose a new password' : 'Accept your invitation'
  return (
    <>
      <style>{ADMIN_STYLES}</style>
      <div className="login-wrap">
        <form className="login-card" onSubmit={submit}>
          <div className="login-logo">Beyond the Horizon</div>
          <div className="login-sub">Website Admin</div>
          <div className="login-title">{title}</div>

          {state === 'loading' && <div className="muted">One moment…</div>}

          {state === 'invalid' && <>
            <div className="login-error" role="alert">
              {kind === 'reset'
                ? 'This reset link is not valid anymore. It may have expired or already been used.'
                : 'This invitation is not valid anymore. It may have expired, been used, or been cancelled. Ask the site Owner for a new one.'}
            </div>
            <a className="login-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }} href="/admin">Go to sign in</a>
          </>}

          {state === 'done' && <>
            <div className="login-ok" role="status">
              {kind === 'reset'
                ? 'Your password was changed. Every device that was signed in has been signed out. Sign in with your new password.'
                : 'Your Developer account is active and you are signed in.'}
            </div>
            <a className="login-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }} href="/admin">
              {kind === 'reset' ? 'Go to sign in' : 'Open the Admin'}
            </a>
          </>}

          {state === 'ready' && <>
            {error && <div className="login-error" role="alert">{error}</div>}
            {invitedEmail && <p className="login-note">You were invited as a Developer with {invitedEmail}. That is the email you will sign in with.</p>}
            {kind === 'invite' && <>
              <label htmlFor="nm" className="field-hint">Your name</label>
              <input id="nm" className="login-input" value={name} onChange={e => setName(e.target.value)} autoComplete="name" maxLength={80} />
            </>}
            {invitedEmail && <input type="email" value={invitedEmail} autoComplete="username" readOnly hidden />}
            <label htmlFor="np" className="field-hint">New password</label>
            <input id="np" className="login-input" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" required minLength={12} autoFocus />
            <p className="login-note">At least 12 characters. A short phrase you will remember works well.</p>
            <label htmlFor="cp" className="field-hint">New password again</label>
            <input id="cp" className="login-input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" required minLength={12} />
            <button className="login-btn" type="submit" disabled={busy}>{busy ? 'Saving…' : kind === 'reset' ? 'Save new password' : 'Activate my account'}</button>
          </>}
        </form>
      </div>
    </>
  )
}
