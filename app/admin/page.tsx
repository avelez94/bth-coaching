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

type ViewKey = PageKey | 'pricing' | 'scheduling' | 'settings' | 'agreement' | 'signed'

// Sidebar: plain-language groups. Website pages appear in the order of the
// site's own navigation. Pages not yet connected to the editor are shown
// with a "coming soon" note rather than hidden.
const WEBSITE_PAGES: { key: string; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'executive-coaching', label: 'Executive Coaching' },
  { key: 'leader-development', label: '8 Pillars Leadership' },
  { key: 'for-organizations', label: 'For Organizations' },
  { key: 'sample-engagements', label: 'Sample Engagements' },
  { key: 'the-8-pillars', label: 'The 8 Pillars' },
  { key: 'about', label: 'About' },
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
]

export interface ViewProps {
  setDirty: (dirty: boolean) => void
  toast: (message: string, isError?: boolean) => void
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [view, setView] = useState<ViewKey>('home')
  const [dirty, setDirty] = useState(false)
  const [toastMsg, setToastMsg] = useState<{ text: string; err: boolean } | null>(null)

  useEffect(() => {
    fetch('/api/admin/auth').then(r => setAuthed(r.ok)).catch(() => setAuthed(false))
  }, [])

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
    setLoginError('')
    const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
    if (res.ok) { setAuthed(true); setPassword('') } else setLoginError('That password is not correct.')
  }

  if (authed === null) {
    return <><style>{ADMIN_STYLES}</style><div className="login-wrap"><div className="muted">Loading…</div></div></>
  }

  if (!authed) {
    return (
      <>
        <style>{ADMIN_STYLES}</style>
        <div className="login-wrap">
          <form className="login-card" onSubmit={login}>
            <div className="login-logo">Beyond the Horizon</div>
            <div className="login-sub">Website Admin</div>
            <div className="login-title">Sign in</div>
            {loginError && <div className="login-error">{loginError}</div>}
            <label htmlFor="pw" className="field-hint">Password</label>
            <input id="pw" className="login-input" type="password" value={password} onChange={e => setPassword(e.target.value)} autoFocus autoComplete="current-password" />
            <button className="login-btn" type="submit">Sign in</button>
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

          <div className="sidebar-footer">
            <a href="/" target="_blank" rel="noopener noreferrer">View website ↗</a>
            <button className="signout-btn" onClick={() => {
              if (dirty && !window.confirm('You have unsaved changes. Sign out anyway?')) return
              fetch('/api/admin/auth', { method: 'DELETE' }).finally(() => setAuthed(false))
            }}>Sign out</button>
          </div>
        </nav>

        <div className="main-area">
          {isPage(view) && <PageEditor key={view} page={view} {...props} />}
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
        </div>
      </div>
      {toastMsg && <div className={`toast ${toastMsg.err ? 'err' : ''}`} role="status">{toastMsg.text}</div>}
    </>
  )
}
