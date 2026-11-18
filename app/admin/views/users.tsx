'use client'

import { useEffect, useState } from 'react'
import type { ViewProps } from '../page'

interface Person {
  id: string; email: string; name: string | null; role: 'owner' | 'developer'
  status: 'invited' | 'active' | 'revoked'; addedOn: string; lastSignIn: string | null; inviteExpires: string | null
}
interface HistoryRow { created_at: string; actor_email: string | null; action: string; target_email: string | null }

const ACTION: Record<string, string> = {
  developer_invited: 'Developer invited', invitation_resent: 'Invitation resent', invitation_accepted: 'Invitation accepted',
  access_revoked: 'Access revoked', password_changed: 'Password changed', password_reset: 'Password reset',
  password_reset_requested: 'Password reset requested', password_set_from_previous: 'Owner password moved to the new sign in',
}
const when = (v: string | null) => v ? new Date(v).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''

// Users & Access (Owner only; the server checks this on every request)
export default function UsersView({ toast }: ViewProps) {
  const [people, setPeople] = useState<Person[] | null>(null)
  const [history, setHistory] = useState<HistoryRow[]>([])
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmRevoke, setConfirmRevoke] = useState<Person | null>(null)

  const load = () => fetch('/api/admin/users').then(r => (r.ok ? r.json() : null)).then(d => {
    if (d) { setPeople(d.users); setHistory(d.history) }
  }).catch(() => {})
  useEffect(() => { load() }, [])

  async function act(body: object) {
    setBusy(true)
    const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const d = await res.json().catch(() => ({}))
    setBusy(false)
    if (res.ok) toast(d.message || 'Done.'); else toast(d.error || 'That did not work.', true)
    await load()
    return res.ok
  }

  async function invite(e: React.FormEvent) {
    e.preventDefault()
    if (await act({ action: 'invite', email, name })) { setEmail(''); setName('') }
  }

  const statusLabel = (p: Person) => p.status === 'active' ? 'Active'
    : p.status === 'invited' ? (p.inviteExpires && new Date(p.inviteExpires) > new Date() ? `Invited, link expires ${when(p.inviteExpires)}` : 'Invitation expired')
    : 'Access revoked'

  return (
    <>
      <div className="main-topbar">
        <div>
          <div className="main-topbar-title">Users &amp; Access</div>
          <div className="main-topbar-sub">Who can sign in to this Admin. Give a developer their own access instead of sharing your password.</div>
        </div>
      </div>
      <div className="page-wrap">
        <p className="intro-box">
          <strong>Owner</strong> is you: full control, including this page. <strong>Developer</strong> can edit the site, settings, agreements and
          purchases to help you, but cannot see this page, change your password, or make anyone an Owner. Remove a Developer when the work is done.
        </p>

        <div className="card">
          <div className="eyebrow">People with access</div>
          {!people ? <div className="muted">Loading…</div> : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Person</th><th>Role</th><th>Status</th><th>Last sign in</th><th></th></tr></thead>
                <tbody>
                  {people.map(p => (
                    <tr key={p.id}>
                      <td>{p.name ? <>{p.name}<br /><span className="muted">{p.email}</span></> : p.email}</td>
                      <td><span className={`role-tag ${p.role === 'developer' ? 'dev' : ''}`}>{p.role === 'owner' ? 'Owner' : 'Developer'}</span></td>
                      <td>{statusLabel(p)}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{when(p.lastSignIn)}</td>
                      <td>
                        {p.role === 'developer' && (
                          <div className="row-actions">
                            {p.status === 'invited' && <button className="ghost-btn" disabled={busy} onClick={() => act({ action: 'resend', id: p.id })}>Resend invitation</button>}
                            {p.status !== 'revoked' && <button className="ghost-btn danger-btn" disabled={busy} onClick={() => setConfirmRevoke(p)}>{p.status === 'invited' ? 'Cancel invitation' : 'Remove access'}</button>}
                            {p.status === 'revoked' && <button className="ghost-btn" disabled={busy} onClick={() => act({ action: 'invite', email: p.email, name: p.name })}>Invite again</button>}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <form className="card" onSubmit={invite}>
          <div className="eyebrow">Invite a Developer</div>
          <p className="card-sub">They get an email with a link to set their own password. The link works once and expires in 48 hours.</p>
          <div className="grid-2">
            <div className="field">
              <label className="field-label" htmlFor="inv-email">Their email</label>
              <input id="inv-email" className="field-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="inv-name">Their name (optional)</label>
              <input id="inv-name" className="field-input" value={name} onChange={e => setName(e.target.value)} maxLength={80} />
            </div>
          </div>
          <button className="save-btn" type="submit" disabled={busy || !email}>{busy ? 'Sending…' : 'Send invitation'}</button>
        </form>

        {history.length > 0 && (
          <div className="card">
            <div className="eyebrow">Recent access changes</div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>When</th><th>What</th><th>Who</th><th>By</th></tr></thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i}>
                      <td style={{ whiteSpace: 'nowrap' }}>{when(h.created_at)}</td>
                      <td>{ACTION[h.action] ?? h.action}</td>
                      <td>{h.target_email ?? ''}</td>
                      <td>{h.actor_email ?? (h.action === 'password_reset_requested' ? 'Reset form' : '')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {confirmRevoke && (
        <div className="modal-back" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="card-title">{confirmRevoke.status === 'invited' ? 'Cancel this invitation?' : 'Remove this Developer?'}</div>
            <p className="card-sub">{confirmRevoke.email} will no longer be able to sign in. Anyone signed in as them is signed out right away. You can invite them again later.</p>
            <div className="modal-actions">
              <button className="ghost-btn" onClick={() => setConfirmRevoke(null)}>Keep access</button>
              <button className="save-btn" disabled={busy} onClick={async () => { const p = confirmRevoke; setConfirmRevoke(null); await act({ action: 'revoke', id: p.id }) }}>
                {confirmRevoke.status === 'invited' ? 'Cancel invitation' : 'Remove access'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
