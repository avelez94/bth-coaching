'use client'

import { useEffect, useState } from 'react'
import type { ViewProps } from '../page'

interface Enrollment {
  id: string; first_name: string; last_name: string; email: string
  program: string; payment_option: string; signed_at: string
  agreement_version: string; status: string; test_mode: boolean
  pdfUrl: string | null; pdfDownloadUrl: string | null
  paid_at: string | null; amount_paid_cents: number | null
  emails: { client?: string; admin?: string; error?: string } | null
}

const PROGRAM: Record<string, string> = { 'executive-coaching': 'Executive Coaching', '8-pillars': '8 Pillars Leadership Program' }
const STATUS: Record<string, { label: string; color: string }> = {
  pending_payment: { label: 'Awaiting payment', color: '#fbbf24' },
  paid: { label: 'Paid', color: '#4ade80' },
  payment_failed: { label: 'Payment failed', color: '#f87171' },
  abandoned: { label: 'Not completed', color: 'rgba(255,255,255,0.4)' },
  test: { label: 'Test', color: '#ffc107' },
}
const signedOn = (iso: string) => new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
}).format(new Date(iso))

export default function SignedView({ toast }: ViewProps) {
  const [rows, setRows] = useState<Enrollment[] | null>(null)
  const [sending, setSending] = useState<string | null>(null)

  async function load() {
    setRows(null)
    const r = await fetch('/api/admin/signed-agreements')
    if (!r.ok) { toast('Signed agreements could not be loaded. Refresh to try again.', true); setRows([]); return }
    setRows((await r.json()).enrollments)
  }
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function resend(e: Enrollment) {
    if (!window.confirm(`Email a copy of the signed agreement to ${e.email}?`)) return
    setSending(e.id)
    const res = await fetch('/api/admin/signed-agreements/resend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enrollmentId: e.id }) })
    const data = await res.json().catch(() => ({}))
    setSending(null)
    if (res.ok) toast(`A copy was emailed to ${e.email}.`)
    else toast(data.error || 'The copy could not be sent.', true)
  }

  return (
    <>
      <div className="main-topbar">
        <div>
          <div className="main-topbar-title">Signed Agreements</div>
          <div className="main-topbar-sub">Every agreement a client has signed online. These are permanent records and cannot be edited. Payment shows Paid only after Stripe confirms it.</div>
        </div>
        <div className="save-bar"><button className="ghost-btn" onClick={load}>Refresh</button></div>
      </div>
      <div className="page-wrap" style={{ maxWidth: 1240 }}>
        {rows === null && <p className="muted">Loading…</p>}
        {rows && rows.length === 0 && <div className="card"><p className="card-sub" style={{ margin: 0 }}>No signed agreements yet. They appear here as soon as a client signs.</p></div>}
        {rows && rows.length > 0 && (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Client name</th><th>Email</th><th>Program</th><th>Payment option</th><th>Date signed</th><th>Version</th><th>Payment</th><th>Emails</th><th>Signed PDF</th></tr>
                </thead>
                <tbody>
                  {rows.map(e => {
                    const st = STATUS[e.status] ?? { label: e.status, color: 'inherit' }
                    return (
                      <tr key={e.id}>
                        <td style={{ fontWeight: 600, color: '#fff' }}>{e.first_name} {e.last_name} {e.test_mode && <span className="tag test">Test</span>}</td>
                        <td>{e.email}</td>
                        <td>{PROGRAM[e.program] ?? e.program}</td>
                        <td>{e.payment_option === 'full' ? 'Paid in full' : 'Monthly installments'}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{signedOn(e.signed_at)}</td>
                        <td>{e.agreement_version}</td>
                        <td style={{ color: st.color, whiteSpace: 'nowrap' }}>
                          {st.label}
                          {e.status === 'paid' && e.amount_paid_cents != null && <div className="muted" style={{ fontSize: 11 }}>${(e.amount_paid_cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}{e.paid_at ? `, ${signedOn(e.paid_at)}` : ''}</div>}
                        </td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: 12 }} title={e.emails?.error ?? ''}>
                          {!e.emails ? <span className="muted">None recorded</span> : (
                            <>
                              <div style={{ color: e.emails.client === 'sent' ? '#4ade80' : '#f87171' }}>Client: {e.emails.client === 'sent' ? 'sent' : 'not sent'}</div>
                              <div style={{ color: e.emails.admin === 'sent' ? '#4ade80' : '#f87171' }}>You: {e.emails.admin === 'sent' ? 'sent' : 'not sent'}</div>
                            </>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {e.pdfUrl ? <a className="ghost-btn" href={e.pdfUrl} target="_blank" rel="noopener noreferrer">View</a> : <span className="muted">Not available</span>}
                            {e.pdfDownloadUrl && <a className="ghost-btn" href={e.pdfDownloadUrl}>Download</a>}
                            {e.pdfUrl && <button className="ghost-btn" onClick={() => resend(e)} disabled={sending === e.id}>{sending === e.id ? 'Sending…' : 'Resend copy'}</button>}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
