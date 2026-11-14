'use client'

import { useEffect, useMemo, useState } from 'react'
import { PROGRAM_KEYS, programLabel, usd, type ProgramKey, type ProgramPricing } from '@/lib/program-info'
import type { ViewProps } from '../page'

// Form values are kept as text so John can type freely; converted on save.
interface Form { price: string; installment: string; count: string; fullUrl: string; installUrl: string }

const toForm = (p: ProgramPricing): Form => ({
  price: String(p.fullPriceCents / 100),
  installment: String(p.installmentAmountCents / 100),
  count: String(p.installmentCount),
  fullUrl: p.stripeFullUrl,
  installUrl: p.stripeInstallmentUrl,
})
const dollarsToCents = (s: string) => Math.round(parseFloat(s.replace(/[$,\s]/g, '')) * 100)
const fromForm = (f: Form): ProgramPricing => ({
  fullPriceCents: dollarsToCents(f.price),
  installmentAmountCents: dollarsToCents(f.installment),
  installmentCount: parseInt(f.count, 10),
  stripeFullUrl: f.fullUrl.trim(),
  stripeInstallmentUrl: f.installUrl.trim(),
})
const STRIPE_RE = /^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_]+$/

function problems(f: Form): string[] {
  const p = fromForm(f)
  const out: string[] = []
  if (!Number.isFinite(p.fullPriceCents) || p.fullPriceCents < 10000) out.push('Enter a program price of at least $100.')
  if (!Number.isFinite(p.installmentAmountCents) || p.installmentAmountCents < 1000) out.push('Enter a monthly installment amount.')
  if (!Number.isInteger(p.installmentCount) || p.installmentCount < 2 || p.installmentCount > 36) out.push('Number of installments must be between 2 and 36.')
  if (!STRIPE_RE.test(p.stripeFullUrl)) out.push('The pay-in-full link must be a Stripe payment link (https://buy.stripe.com/...).')
  if (!STRIPE_RE.test(p.stripeInstallmentUrl)) out.push('The installment link must be a Stripe payment link (https://buy.stripe.com/...).')
  return out
}

export default function PricingView({ setDirty, toast }: ViewProps) {
  const [saved, setSaved] = useState<Record<ProgramKey, ProgramPricing> | null>(null)
  const [forms, setForms] = useState<Record<ProgramKey, Form> | null>(null)
  const [agreementText, setAgreementText] = useState('')
  const [confirming, setConfirming] = useState<ProgramKey | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/pricing').then(r => r.json()).then(d => {
      setSaved(d.pricing)
      setForms({ 'executive-coaching': toForm(d.pricing['executive-coaching']), '8-pillars': toForm(d.pricing['8-pillars']) })
    }).catch(() => toast('Pricing could not be loaded. Refresh to try again.', true))
    fetch('/api/admin/agreements').then(r => r.json()).then(d => {
      setAgreementText(d.agreements?.find((a: { is_active: boolean }) => a.is_active)?.content ?? '')
    }).catch(() => {})
  }, [toast])

  const dirtyKeys = useMemo(() => {
    if (!saved || !forms) return [] as ProgramKey[]
    return PROGRAM_KEYS.filter(k => JSON.stringify(toForm(saved[k])) !== JSON.stringify(forms[k]))
  }, [saved, forms])
  useEffect(() => { setDirty(dirtyKeys.length > 0) }, [dirtyKeys, setDirty])

  function update(k: ProgramKey, field: keyof Form, v: string) {
    setForms(f => (f ? { ...f, [k]: { ...f[k], [field]: v } } : f))
  }

  function summary(k: ProgramKey) {
    const before = saved![k]
    const after = fromForm(forms![k])
    const name = programLabel(k)
    const lines: string[] = []
    if (before.fullPriceCents !== after.fullPriceCents) lines.push(`${name} will change from ${usd(before.fullPriceCents)} to ${usd(after.fullPriceCents)} for future enrollments.`)
    if (before.installmentCount !== after.installmentCount || before.installmentAmountCents !== after.installmentAmountCents)
      lines.push(`The monthly option will change from ${before.installmentCount} payments of ${usd(before.installmentAmountCents)} to ${after.installmentCount} payments of ${usd(after.installmentAmountCents)}.`)
    if (before.stripeFullUrl !== after.stripeFullUrl) lines.push('Clients paying in full will be sent to the new Stripe pay-in-full link.')
    if (before.stripeInstallmentUrl !== after.stripeInstallmentUrl) lines.push('Clients paying monthly will be sent to the new Stripe installment link.')

    const warnings: string[] = []
    if (after.installmentAmountCents * after.installmentCount !== after.fullPriceCents)
      warnings.push(`${after.installmentCount} payments of ${usd(after.installmentAmountCents)} add up to ${usd(after.installmentAmountCents * after.installmentCount)}, not the program price of ${usd(after.fullPriceCents)}. Check that this is intended.`)
    const priceChanged = before.fullPriceCents !== after.fullPriceCents || before.installmentAmountCents !== after.installmentAmountCents || before.installmentCount !== after.installmentCount
    if (priceChanged && before.stripeFullUrl === after.stripeFullUrl && before.fullPriceCents !== after.fullPriceCents)
      warnings.push('Stripe will keep charging the old full price until you create a new pay-in-full payment link in Stripe and paste it here.')
    if (priceChanged && before.stripeInstallmentUrl === after.stripeInstallmentUrl && (before.installmentAmountCents !== after.installmentAmountCents || before.installmentCount !== after.installmentCount))
      warnings.push('Stripe will keep charging the old monthly amount until you create a new installment payment link in Stripe and paste it here.')
    if (priceChanged && agreementText.includes(usd(before.fullPriceCents)))
      warnings.push(`The Coaching Agreement still lists ${usd(before.fullPriceCents)} for ${name}. Update it in Coaching Agreement and activate the new version so new clients sign the correct price.`)
    return { lines, warnings }
  }

  async function confirmSave(k: ProgramKey) {
    setSaving(true)
    const res = await fetch('/api/admin/pricing', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ program: k, pricing: fromForm(forms![k]) }) })
    const data = await res.json().catch(() => ({}))
    setSaving(false)
    setConfirming(null)
    if (!res.ok) { toast(data.error || 'Could not save. Please try again.', true); return }
    setSaved(data.pricing)
    setForms(f => (f ? { ...f, [k]: toForm(data.pricing[k]) } : f))
    toast(`${programLabel(k)} pricing saved. It is live for new enrollments now.`)
  }

  return (
    <>
      <div className="main-topbar">
        <div>
          <div className="main-topbar-title">Pricing & Payments</div>
          <div className="main-topbar-sub">Prices and Stripe payment links for both programs. This is the only place prices are set. Saving here updates the program pages, For Organizations, enrollment, and the signed agreement record.</div>
        </div>
        <div className="save-bar">
          {forms && (dirtyKeys.length ? <span className="status-pill unsaved">Unsaved changes</span> : <span className="status-pill saved">All changes saved</span>)}
        </div>
      </div>
      <div className="page-wrap">
        <div className="notice"><strong>Good to know:</strong> Price changes apply to future enrollments only. Clients who already signed keep the price they signed at. Changing a price here does not change what Stripe charges, so create a matching payment link in Stripe and paste it below.</div>
        {forms && saved && (
          <div className="grid-2">
            {PROGRAM_KEYS.map(k => {
              const f = forms[k]
              const errs = problems(f)
              const isDirty = dirtyKeys.includes(k)
              return (
                <div key={k} className="card">
                  <div className="card-title">{programLabel(k)}</div>
                  <div className="card-sub">Now: {usd(saved[k].fullPriceCents)}, or {saved[k].installmentCount} monthly payments of {usd(saved[k].installmentAmountCents)}</div>
                  <div className="field">
                    <label className="field-label" htmlFor={`${k}-price`}>Program price</label>
                    <div className="money"><span>$</span><input id={`${k}-price`} className="field-input" inputMode="decimal" value={f.price} onChange={e => update(k, 'price', e.target.value)} /></div>
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label className="field-label" htmlFor={`${k}-inst`}>Monthly installment</label>
                      <div className="money"><span>$</span><input id={`${k}-inst`} className="field-input" inputMode="decimal" value={f.installment} onChange={e => update(k, 'installment', e.target.value)} /></div>
                    </div>
                    <div className="field">
                      <label className="field-label" htmlFor={`${k}-count`}>Number of installments</label>
                      <input id={`${k}-count`} className="field-input" inputMode="numeric" value={f.count} onChange={e => update(k, 'count', e.target.value)} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor={`${k}-full`}>Pay-in-full Stripe link</label>
                    <span className="field-hint">From Stripe: Payment Links, then copy the link for the one-time payment.</span>
                    <input id={`${k}-full`} className="field-input" value={f.fullUrl} onChange={e => update(k, 'fullUrl', e.target.value)} />
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor={`${k}-installurl`}>Installment Stripe link</label>
                    <span className="field-hint">From Stripe: the subscription payment link for the monthly plan.</span>
                    <input id={`${k}-installurl`} className="field-input" value={f.installUrl} onChange={e => update(k, 'installUrl', e.target.value)} />
                  </div>
                  {isDirty && errs.length > 0 && <div className="field-error" style={{ marginTop: 12 }}>{errs.map(e => <div key={e}>{e}</div>)}</div>}
                  <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                    <button className="save-btn" disabled={!isDirty || errs.length > 0} onClick={() => setConfirming(k)}>Review & Save</button>
                    {isDirty && <button className="ghost-btn" onClick={() => setForms(fs => (fs ? { ...fs, [k]: toForm(saved[k]) } : fs))}>Discard</button>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {confirming && forms && saved && (() => {
        const { lines, warnings } = summary(confirming)
        return (
          <div className="modal-back" role="dialog" aria-modal="true">
            <div className="modal">
              <h3>Confirm {programLabel(confirming)} changes</h3>
              <ul>{lines.map(l => <li key={l}>{l}</li>)}</ul>
              {warnings.map(w => <div key={w} className="notice warn"><strong>Check:</strong> {w}</div>)}
              <p className="muted" style={{ fontSize: 12 }}>Agreements and payments already signed keep their original price.</p>
              <div className="modal-actions">
                <button className="ghost-btn" onClick={() => setConfirming(null)} disabled={saving}>Go back</button>
                <button className="save-btn" onClick={() => confirmSave(confirming)} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
              </div>
            </div>
          </div>
        )
      })()}
    </>
  )
}
