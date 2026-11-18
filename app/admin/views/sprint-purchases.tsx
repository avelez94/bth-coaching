'use client'

import { Fragment, useEffect, useState } from 'react'
import type { ViewProps } from '../page'

interface Purchase {
  id: string; created_at: string; kind: 'sprint_self' | 'sprint_gift'
  customer_name: string | null; customer_email: string | null
  amount_total_cents: number | null; payment_status: string; livemode: boolean
  amount_refunded_cents: number | null; refunded_at: string | null
  participant: { name: string; email: string; phone: string | null; terms_version: string | null } | null
}
interface Awaiting { id: string; created_at: string; name: string; email: string; phone: string | null; status: 'pending_payment' | 'payment_failed' }

type GiftStatus = 'purchased' | 'redeemed' | 'refunded' | 'cancelled'
interface Gift {
  id: string; created_at: string; code: string; status: GiftStatus; livemode: boolean
  purchaser_name: string | null; purchaser_email: string | null; amount_cents: number | null
  stripe_session_id: string; payment_intent: string | null; amount_refunded_cents: number | null
  redeemed_at: string | null; recipient_name: string | null; recipient_email: string | null; recipient_phone: string | null
  terms_version: string | null; refunded_at: string | null; cancelled_at: string | null; cancel_note: string | null
  certificate_sent_at: string | null; last_certificate_email: { status: string; created_at: string; error: string | null } | null
  link: string
}

const when = (iso: string) => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(iso))
const money = (c: number | null) => `$${((c ?? 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

const BADGE: Record<GiftStatus, { label: string; bg: string; fg: string; help: string }> = {
  purchased: { label: 'Purchased', bg: 'rgba(201,162,58,0.18)', fg: '#C9A23A', help: 'Paid. Waiting for the recipient to claim it.' },
  redeemed: { label: 'Redeemed', bg: 'rgba(74,222,128,0.15)', fg: '#4ade80', help: 'Claimed. The recipient is registered.' },
  refunded: { label: 'Refunded', bg: 'rgba(248,113,113,0.15)', fg: '#f87171', help: 'Stripe reports the payment refunded. The link no longer works.' },
  cancelled: { label: 'Cancelled', bg: 'rgba(255,255,255,0.08)', fg: 'rgba(255,255,255,0.6)', help: 'Cancelled by you in Admin (internal only). The link no longer works.' },
}

// Sprint purchases come straight from Stripe (no agreement is signed).
// Gifts are created automatically when Stripe confirms a gift payment.
export default function SprintPurchasesView({ toast }: ViewProps) {
  const [rows, setRows] = useState<Purchase[] | null>(null)
  const [awaiting, setAwaiting] = useState<Awaiting[]>([])
  const [gifts, setGifts] = useState<Gift[] | null>(null)
  const [deadline, setDeadline] = useState<{ redeemBy: string; closed: boolean } | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/sprint-purchases')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => { if (!cancelled) { setRows(d.purchases); setAwaiting(d.awaiting ?? []) } })
      .catch(() => { if (!cancelled) { toast('Sprint purchases could not be loaded. Refresh to try again.', true); setRows([]) } })
    fetch('/api/admin/sprint-gifts')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => { if (!cancelled) { setGifts(d.gifts); setDeadline({ redeemBy: d.redeemBy, closed: d.redemptionClosed }) } })
      .catch(() => { if (!cancelled) { toast('Sprint gifts could not be loaded. Refresh to try again.', true); setGifts([]) } })
    return () => { cancelled = true }
  }, [toast, version])
  const load = () => { setRows(null); setGifts(null); setVersion(v => v + 1) }

  async function copyLink(g: Gift) {
    try { await navigator.clipboard.writeText(g.link); toast(`Redemption link for ${g.code} copied.`) }
    catch { window.prompt('Copy this redemption link:', g.link) }
  }

  async function act(g: Gift, action: 'resend' | 'cancel') {
    let note: string | null = null
    if (action === 'resend') {
      if (!window.confirm(`Email the gift certificate for ${g.code} to ${g.purchaser_email ?? 'the buyer'} again?`)) return
    } else {
      note = window.prompt(
        `Mark gift ${g.code} as Cancelled?\n\nThis is an internal status only. It does NOT refund anything in Stripe (issue refunds in Stripe; the gift then updates to Refunded on its own). The gift link stops working.\n\nOptional note for your records:`, '')
      if (note === null) return
    }
    setBusy(g.id)
    const res = await fetch('/api/admin/sprint-gifts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, id: g.id, note }) })
    const data = await res.json().catch(() => ({}))
    setBusy(null)
    if (res.ok) { toast(data.message || 'Done.'); load() } else toast(data.error || 'That did not work. Try again.', true)
  }

  const certLabel = (g: Gift) => {
    if (g.certificate_sent_at) return { text: `Sent ${when(g.certificate_sent_at)}`, color: '#4ade80' }
    const e = g.last_certificate_email
    if (!e) return { text: 'Not sent yet', color: '#fbbf24' }
    return { text: e.status === 'skipped' ? 'Not sent (email not set up yet)' : 'Not sent (email failed)', color: '#f87171' }
  }

  return (
    <>
      <div className="main-topbar">
        <div>
          <div className="main-topbar-title">Sprint Purchases</div>
          <div className="main-topbar-sub">Every 8 Pillar Sprint payment Stripe has confirmed, for the buyer themselves or as a gift, and every gift certificate.</div>
        </div>
        <div className="save-bar"><button className="ghost-btn" onClick={load}>Refresh</button></div>
      </div>
      <div className="page-wrap" style={{ maxWidth: 1240 }}>
        {/* ===== Gifts ===== */}
        <h2 className="section-heading">Gifts {gifts && <span className="muted">({gifts.length})</span>}</h2>
        <p className="field-hint" style={{ marginBottom: 12 }}>
          When Stripe confirms a gift payment, a gift certificate with its own code and link is emailed to the buyer automatically. The recipient uses it to register. Each gift can be claimed once.
          {deadline && <> Gifts can be claimed until the Sprint registration deadline, {deadline.redeemBy} at 11:59 PM Eastern{deadline.closed ? ' (that date has passed)' : ''}. You can change this date under Pricing.</>}
        </p>
        {gifts === null && <p className="muted">Loading…</p>}
        {gifts && gifts.length === 0 && <div className="card"><p className="card-sub" style={{ margin: 0 }}>No gifts yet. They appear here as soon as Stripe confirms a gift payment.</p></div>}
        {gifts && gifts.length > 0 && (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Purchased</th><th>Buyer</th><th>Gift code</th><th>Status</th><th>Recipient</th><th>Redeemed</th><th>Stripe reference</th><th></th></tr></thead>
                <tbody>
                  {gifts.map(g => {
                    // Unused after the deadline: kept on record, but the link no longer works
                    const b = g.status === 'purchased' && deadline?.closed
                      ? { ...BADGE.purchased, label: 'Not claimed', help: `Paid, but not claimed by ${deadline.redeemBy}. The link no longer works. The payment and any refund stay on record.` }
                      : BADGE[g.status]
                    const isOpen = open === g.id
                    return (
                      <Fragment key={g.id}>
                        <tr>
                          <td style={{ whiteSpace: 'nowrap' }}>{when(g.created_at)} {!g.livemode && <span className="tag test">Test</span>}</td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#fff' }}>{g.purchaser_name ?? 'Not provided'}</div>
                            <div className="muted" style={{ fontSize: 12 }}>{g.purchaser_email ?? 'No email'}</div>
                          </td>
                          <td style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12, whiteSpace: 'nowrap' }}>{g.code}</td>
                          <td><span title={b.help} style={{ background: b.bg, color: b.fg, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', whiteSpace: 'nowrap' }}>{b.label}</span></td>
                          <td>
                            {g.recipient_name
                              ? <><div style={{ color: '#fff' }}>{g.recipient_name}</div><div className="muted" style={{ fontSize: 12 }}>{g.recipient_email}</div></>
                              : <span className="muted">Not claimed yet</span>}
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>{g.redeemed_at ? when(g.redeemed_at) : <span className="muted">None</span>}</td>
                          <td style={{ fontSize: 11, wordBreak: 'break-all', maxWidth: 160 }} title={g.stripe_session_id}>{g.payment_intent ?? g.stripe_session_id.slice(0, 24) + '…'}</td>
                          <td>
                            <button className="ghost-btn" onClick={() => setOpen(isOpen ? null : g.id)} aria-expanded={isOpen}>{isOpen ? 'Hide' : 'Details'}</button>
                          </td>
                        </tr>
                        {isOpen && (
                          <tr>
                            <td colSpan={8} style={{ background: 'rgba(255,255,255,0.03)' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px 28px', fontSize: 13, padding: '6px 0 12px' }}>
                                <Detail k="Status" v={`${b.label}. ${b.help}`} />
                                <Detail k="Amount paid" v={money(g.amount_cents)} />
                                <Detail k="Certificate email" v={<span style={{ color: certLabel(g).color }}>{certLabel(g).text}</span>} />
                                <Detail k="Refund" v={g.refunded_at ? `Refunded ${when(g.refunded_at)} (${money(g.amount_refunded_cents)})` : g.amount_refunded_cents ? `Partly refunded (${money(g.amount_refunded_cents)}); the gift is still usable` : 'None'} />
                                <Detail k="Cancelled" v={g.cancelled_at ? `${when(g.cancelled_at)}, internal only${g.cancel_note ? `: ${g.cancel_note}` : ''}` : 'No'} />
                                <Detail k="Recipient phone" v={g.recipient_phone || 'Not provided'} />
                                <Detail k="Stripe checkout" v={<span style={{ wordBreak: 'break-all' }}>{g.stripe_session_id}</span>} />
                                {g.terms_version && <Detail k="Terms accepted" v={g.terms_version} />}
                              </div>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <button className="ghost-btn" onClick={() => copyLink(g)}>Copy redemption link</button>
                                {g.status === 'purchased' && <button className="ghost-btn" onClick={() => act(g, 'resend')} disabled={busy === g.id}>{busy === g.id ? 'Working…' : 'Resend certificate to buyer'}</button>}
                                {g.status === 'purchased' && <button className="ghost-btn danger-btn" onClick={() => act(g, 'cancel')} disabled={busy === g.id}>Mark cancelled (internal only)</button>}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== All payments ===== */}
        <h2 className="section-heading" style={{ marginTop: 36 }}>All Sprint payments {rows && <span className="muted">({rows.length})</span>}</h2>
        {rows === null && <p className="muted">Loading…</p>}
        {rows && rows.length === 0 && <div className="card"><p className="card-sub" style={{ margin: 0 }}>No Sprint purchases yet. They appear here as soon as Stripe confirms a payment.</p></div>}
        {rows && rows.length > 0 && (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Date</th><th>Type</th><th>Buyer or participant</th><th>Email</th><th>Paid</th><th>Status</th></tr></thead>
                <tbody>
                  {rows.map(p => {
                    const paid = p.payment_status === 'paid' || p.payment_status === 'no_payment_required'
                    const label = p.refunded_at ? 'Refunded' : p.amount_refunded_cents ? 'Partly refunded' : paid ? 'Paid' : p.payment_status === 'failed' ? 'Failed' : 'Processing'
                    const color = p.refunded_at || p.payment_status === 'failed' ? '#f87171' : p.amount_refunded_cents ? '#fbbf24' : paid ? '#4ade80' : '#fbbf24'
                    return (
                      <tr key={p.id}>
                        <td style={{ whiteSpace: 'nowrap' }}>{when(p.created_at)}</td>
                        <td>{p.kind === 'sprint_gift' ? <span className="tag active">Gift</span> : 'For themselves'} {!p.livemode && <span className="tag test">Test</span>}</td>
                        <td style={{ fontWeight: 600, color: '#fff' }}>
                          {p.participant?.name ?? p.customer_name ?? 'Not provided'}
                          {p.participant?.phone && <div className="muted" style={{ fontSize: 11, fontWeight: 400 }}>{p.participant.phone}</div>}
                        </td>
                        {(() => { const e = p.participant?.email ?? p.customer_email; return <td>{e ? <a className="open-link" href={`mailto:${e}`}>{e}</a> : 'Not provided'}</td> })()}
                        <td>{money(p.amount_total_cents)}</td>
                        <td style={{ color }}>{label}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== Registered, not paid ===== */}
        {awaiting.length > 0 && (
          <>
            <h2 className="section-heading" style={{ marginTop: 36 }}>Registered, payment not confirmed <span className="muted">({awaiting.length})</span></h2>
            <p className="field-hint" style={{ marginBottom: 12 }}>
              These people filled in the Sprint registration but Stripe has not confirmed a payment, so they are not enrolled. Someone who pays later moves to the list above automatically.
            </p>
            <div className="card" style={{ padding: 0 }}>
              <div className="table-wrap">
                <table className="table">
                  <thead><tr><th>Registered</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th></tr></thead>
                  <tbody>
                    {awaiting.map(a => (
                      <tr key={a.id}>
                        <td style={{ whiteSpace: 'nowrap' }}>{when(a.created_at)}</td>
                        <td style={{ fontWeight: 600, color: '#fff' }}>{a.name}</td>
                        <td><a className="open-link" href={`mailto:${a.email}`}>{a.email}</a></td>
                        <td>{a.phone ?? 'Not provided'}</td>
                        <td style={{ color: a.status === 'payment_failed' ? '#f87171' : '#fbbf24' }}>{a.status === 'payment_failed' ? 'Payment failed' : 'Awaiting payment'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

function Detail({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div>
      <div className="muted" style={{ fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
      <div style={{ color: 'rgba(255,255,255,0.85)' }}>{v}</div>
    </div>
  )
}
