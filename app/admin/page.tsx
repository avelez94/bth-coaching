'use client'

import { useCallback, useEffect, useState } from 'react'
import { ADMIN_STYLES } from './admin-styles'
import { PAGE_SCHEMA, type PageKey } from '@/lib/site-content'
import PageEditor from './views/page-editor'
import PricingView from './views/pricing'
import SchedulingView from './views/scheduling'
import SettingsView from './views/site-settings'
import AgreementView from './views/agreement'
import SignedView from './views/signed-agreements'
import SprintPurchasesView from './views/sprint-purchases'
import AccountView from './views/account'
import UsersView from './views/users'
import { isOptionalPage, type OptionalPageKey, type PageStatus } from '@/lib/optional-pages'

type ViewKey = PageKey | 'pricing' | 'scheduling' | 'settings' | 'agreement' | 'signed' | 'sprint-purchases' | 'account' | 'users'
export interface AdminMe { email: string; name: string | null; role: 'owner' | 'developer' }

// Sidebar: plain-language groups. Website pages appear in the order of the
// site's own navigation. Pages not yet connected to the editor are shown
// with a "coming soon" note rather than hidden.
const WEBSITE_PAGES: { key: string; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'executive-coaching', label: 'Executive Coaching' },
  { key: 'leader-development', label: '8 Pillars Leadership' },
  { key: 'sprint', label: '8 Pillar Sprint' },
  { key: 'for-organizations', label: 'For Organizations' },
  { key: 'sample-engagements', label: 'Sample Engagements' },
  { key: 'the-8-pillars', label: 'The 8 Pillars' },
  { key: 'about', label: 'About' },
  { key: 'faq', label: 'FAQ' },
  { key: 'contact', label: 'Contact' },
]
const BUSINESS: { key: ViewKey; label: string }[] = [
  { key: 'pricing', label: 'Pricing & Payments' },
  { key: 'scheduling', label: 'Scheduling' },
  { key: 'settings', label: 'Site Settings' },
]
const ENROLLMENT: { key: ViewKey; label: string }[] = [
  { key: 'agreement', label: 'Coaching Agreement' },
  { key: 'signed', label: 'Signed Agreements' },
  { key: 'sprint-purchases', label: 'Sprint Purchases' },
]

export interface ViewProps {
  setDirty: (dirty: boolean) => void
  toast: (message: string, isError?: boolean) => void
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [me, setMe] = useState<AdminMe | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginNote, setLoginNote] = useState('')
  const [forgot, setForgot] = useState(false)
  const [busy, setBusy] = useState(false)
  const [view, setView] = useState<ViewKey>('home')
  const [dirty, setDirty] = useState(false)
  const [toastMsg, setToastMsg] = useState<{ text: string; err: boolean } | null>(null)
  const [statuses, setStatuses] = useState<Record<OptionalPageKey, PageStatus> | null>(null)

  useEffect(() => {
    checkSession()
  }, [])

  function checkSession() {
    return fetch('/api/admin/auth').then(async r => {
      const d = r.ok ? await r.json() : null
      setMe(d?.user ?? null)
      setAuthed(Boolean(d?.valid))
    }).catch(() => setAuthed(false))
  }

  // After a password change every session ends, so return to sign in
  const signedOut = useCallback((note: string) => {
    setDirty(false); setView('home'); setMe(null); setAuthed(false); setLoginNote(note)
  }, [])

  // Page Status (Active / Hidden) for the optional pages, shown in the sidebar
  useEffect(() => {
    if (!authed) return
    fetch('/api/admin/page-status').then(r => (r.ok ? r.json() : null)).then(d => d && setStatuses(d.statuses)).catch(() => {})
  }, [authed])

  // Warn before closing the tab with unsaved changes
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = '' } }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  const toast = useCallback((text: string, err = false) => {
    setToastMsg({ text, err })
    window.setTimeout(() => setToastMsg(null), err ? 7000 : 3500)
  }, [])

  function go(next: ViewKey) {
    if (next === view) return
    if (dirty && !window.confirm('You have unsaved changes on this screen. Leave without saving?')) return
    setDirty(false)
    setView(next)
  }

  async function login(e?: React.FormEvent) {
    e?.preventDefault()
    setLoginError(''); setLoginNote(''); setBusy(true)
    const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    const d = await res.json().catch(() => ({}))
    setBusy(false)
    if (res.ok) { setPassword(''); await checkSession() } else setLoginError(d.error || 'Sign in did not work. Try again.')
  }

  async function requestReset(e?: React.FormEvent) {
    e?.preventDefault()
    setLoginError(''); setLoginNote(''); setBusy(true)
    const res = await fetch('/api/admin/password/forgot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    const d = await res.json().catch(() => ({}))
    setBusy(false)
    if (res.ok) { setLoginNote(d.message); setForgot(false) } else setLoginError(d.error || 'That did not work. Try again.')
  }

  if (authed === null) {
    return <><style>{ADMIN_STYLES}</style><div className="login-wrap"><div className="muted">Loading…</div></div></>
  }

  if (!authed) {
    return (
      <>
        <style>{ADMIN_STYLES}</style>
        <div className="login-wrap">
          <form className="login-card" onSubmit={forgot ? requestReset : login}>
            <div className="login-logo">Beyond the Horizon</div>
            <div className="login-sub">Website Admin</div>
            <div className="login-title">{forgot ? 'Reset your password' : 'Sign in'}</div>
            {loginNote && <div className="login-ok" role="status">{loginNote}</div>}
            {loginError && <div className="login-error" role="alert">{loginError}</div>}
            {forgot && <p className="login-note">Enter the email you sign in with. We will email you a link to choose a new password.</p>}
            <label htmlFor="em" className="field-hint">Email</label>
            <input id="em" className="login-input" type="email" value={email} onChange={e => setEmail(e.target.value)} autoFocus autoComplete="username" required />
            {!forgot && <>
              <label htmlFor="pw" className="field-hint">Password</label>
              <input id="pw" className="login-input" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
            </>}
            <button className="login-btn" type="submit" disabled={busy}>{busy ? 'One moment…' : forgot ? 'Email me a reset link' : 'Sign in'}</button>
            <button type="button" className="login-link" onClick={() => { setForgot(!forgot); setLoginError('') }}>
              {forgot ? 'Back to sign in' : 'Forgot password?'}
            </button>
          </form>
        </div>
      </>
    )
  }

  const isPage = (k: string): k is PageKey => k in PAGE_SCHEMA
  const props: ViewProps = { setDirty, toast }

  return (
    <>
      <style>{ADMIN_STYLES}</style>
      <div className="admin-shell">
        <nav className="sidebar" aria-label="Admin sections">
          <div className="sidebar-logo">
            <div className="sidebar-logo-name">Beyond the Horizon</div>
            <div className="sidebar-logo-sub">Website Admin</div>
          </div>

          <div className="sidebar-group">
            <div className="sidebar-group-label">Website</div>
            {WEBSITE_PAGES.map(p => (
              <button key={p.key} className={`nav-item ${view === p.key ? 'active' : ''}`} onClick={() => go(p.key as ViewKey)}>
                <span>{p.label}</span>
                {!isPage(p.key) && <span className="muted" style={{ fontSize: 10 }}>soon</span>}
                {isOptionalPage(p.key) && statuses?.[p.key] === 'hidden' && <span className="tag hidden-tag">Hidden</span>}
              </button>
            ))}
          </div>
          <div className="sidebar-group">
            <div className="sidebar-group-label">Business Settings</div>
            {BUSINESS.map(p => (
              <button key={p.key} className={`nav-item ${view === p.key ? 'active' : ''}`} onClick={() => go(p.key)}>{p.label}</button>
            ))}
          </div>
          <div className="sidebar-group">
            <div className="sidebar-group-label">Enrollment</div>
            {ENROLLMENT.map(p => (
              <button key={p.key} className={`nav-item ${view === p.key ? 'active' : ''}`} onClick={() => go(p.key)}>{p.label}</button>
            ))}
          </div>

          <div className="sidebar-group">
            <div className="sidebar-group-label">Account</div>
            <button className={`nav-item ${view === 'account' ? 'active' : ''}`} onClick={() => go('account')}>Your Account</button>
            {me?.role === 'owner' && (
              <button className={`nav-item ${view === 'users' ? 'active' : ''}`} onClick={() => go('users')}>Users &amp; Access</button>
            )}
          </div>

          <div className="sidebar-footer">
            {me && <div className="sidebar-who">Signed in as {me.email}<br /><span className={`role-tag ${me.role === 'developer' ? 'dev' : ''}`}>{me.role === 'owner' ? 'Owner' : 'Developer'}</span></div>}
            <a href="/" target="_blank" rel="noopener noreferrer">View website ↗</a>
            <button className="signout-btn" onClick={() => {
              if (dirty && !window.confirm('You have unsaved changes. Sign out anyway?')) return
              fetch('/api/admin/auth', { method: 'DELETE' }).finally(() => { setAuthed(false); setMe(null) })
            }}>Sign out</button>
          </div>
        </nav>

        <div className="main-area">
          {isPage(view) && (
            <PageEditor key={view} page={view} {...props}
              status={isOptionalPage(view) && statuses ? statuses[view] : undefined}
              onStatusChange={setStatuses} />
          )}
          {!isPage(view) && WEBSITE_PAGES.some(p => p.key === view) && (
            <div className="page-wrap">
              <div className="card">
                <div className="card-title">{WEBSITE_PAGES.find(p => p.key === view)?.label}</div>
                <p className="card-sub">The editor for this page is being connected. Until then, changes to this page are made by your developer.</p>
              </div>
            </div>
          )}
          {view === 'pricing' && <PricingView {...props} />}
          {view === 'scheduling' && <SchedulingView {...props} />}
          {view === 'settings' && <SettingsView {...props} />}
          {view === 'agreement' && <AgreementView {...props} />}
          {view === 'signed' && <SignedView {...props} />}
          {view === 'sprint-purchases' && <SprintPurchasesView {...props} />}
          {view === 'account' && me && <AccountView {...props} me={me} onSignedOut={signedOut} />}
          {view === 'users' && me?.role === 'owner' && <UsersView {...props} />}
        </div>
      </div>
      {toastMsg && <div className={`toast ${toastMsg.err ? 'err' : ''}`} role="status">{toastMsg.text}</div>}
    </>
  )
}
