'use client'

import { useEffect, useState } from 'react'
import type { ViewProps } from '../page'

interface Purchase {
  id: string; created_at: string; kind: 'sprint_self' | 'sprint_gift'
  customer_name: string | null; customer_email: string | null
  amount_total_cents: number | null; payment_status: string; livemode: boolean
}

const when = (iso: string) => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(iso))

// Sprint purchases come straight from Stripe (no agreement is signed).
// Gift buyers need a gift certificate emailed to them.
export default function SprintPurchasesView({ toast }: ViewProps) {
  const [rows, setRows] = useState<Purchase[] | null>(null)
  const [version, setVersion] = useState(0)
  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/sprint-purchases')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => { if (!cancelled) setRows(d.purchases) })
      .catch(() => { if (!cancelled) { toast('Sprint purchases could not be loaded. Refresh to try again.', true); setRows([]) } })
    return () => { cancelled = true }
  }, [toast, version])
  const load = () => { setRows(null); setVersion(v => v + 1) }

  return (
    <>
      <div className="main-topbar">
        <div>
          <div className="main-topbar-title">Sprint Purchases</div>
          <div className="main-topbar-sub">Every 8 Pillar Sprint payment Stripe has confirmed, for the buyer themselves or as a gift. You also get an email for each one.</div>
        </div>
        <div className="save-bar"><button className="ghost-btn" onClick={load}>Refresh</button></div>
      </div>
      <div className="page-wrap" style={{ maxWidth: 1100 }}>
        <div className="notice"><strong>Gifts:</strong> the buyer expects a gift certificate by email to pass along. Send it to the buyer&apos;s email shown here.</div>
        {rows === null && <p className="muted">Loading…</p>}
        {rows && rows.length === 0 && <div className="card"><p className="card-sub" style={{ margin: 0 }}>No Sprint purchases yet. They appear here as soon as Stripe confirms a payment.</p></div>}
        {rows && rows.length > 0 && (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Date</th><th>Type</th><th>Buyer</th><th>Email</th><th>Paid</th><th>Status</th></tr></thead>
                <tbody>
                  {rows.map(p => (
                    <tr key={p.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{when(p.created_at)}</td>
                      <td>{p.kind === 'sprint_gift' ? <span className="tag active">Gift</span> : 'For themselves'} {!p.livemode && <span className="tag test">Test</span>}</td>
                      <td style={{ fontWeight: 600, color: '#fff' }}>{p.customer_name ?? 'Not provided'}</td>
                      <td>{p.customer_email ? <a className="open-link" href={`mailto:${p.customer_email}`}>{p.customer_email}</a> : 'Not provided'}</td>
                      <td>${((p.amount_total_cents ?? 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td style={{ color: p.payment_status === 'paid' || p.payment_status === 'no_payment_required' ? '#4ade80' : p.payment_status === 'failed' ? '#f87171' : '#fbbf24' }}>
                        {p.payment_status === 'paid' || p.payment_status === 'no_payment_required' ? 'Paid' : p.payment_status === 'failed' ? 'Failed' : 'Processing'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
