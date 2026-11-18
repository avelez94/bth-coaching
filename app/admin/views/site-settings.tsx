'use client'

import { useEffect, useState } from 'react'
import { useSettingsForm, type SettingField } from './settings-form'
import type { ViewProps } from '../page'

const CONTACT: SettingField[] = [
  { key: 'contactEmail', label: 'Contact email', help: 'Shown in the footer and on the Contact page, and printed on signed agreements.' },
  { key: 'phone', label: 'Phone number', help: 'Shown in the footer and on the Contact page, and printed on signed agreements. Example: 703-705-2225' },
  { key: 'linkedinCompanyUrl', label: 'LinkedIn: Beyond the Horizon page', help: 'The full address of the company page. Leave blank to hide it.' },
  { key: 'linkedinPersonalUrl', label: 'LinkedIn: your personal profile', help: 'The full address of your profile. Leave blank to hide it.' },
]
const FOOTER: SettingField[] = [
  { key: 'businessName', label: 'Business name', help: 'Used in the copyright line at the bottom of every page.' },
  { key: 'footerDescription', label: 'Short description', help: 'The line under the logo in the footer.' },
  { key: 'location', label: 'Location line', help: 'Shown under the description in the footer.' },
  { key: 'footerTagline', label: 'Tagline', help: 'The closing line at the bottom of every page.' },
]

export default function SettingsView(props: ViewProps) {
  const { draft, renderField, saveBar } = useSettingsForm([...CONTACT, ...FOOTER], props)
  return (
    <>
      <div className="main-topbar">
        <div>
          <div className="main-topbar-title">Site Settings</div>
          <div className="main-topbar-sub">Your contact details and the information in the footer of every page.</div>
        </div>
        {saveBar}
      </div>
      <div className="page-wrap">
        <p className="intro-box">Booking links for the &ldquo;Schedule a call&rdquo; buttons are under <strong>Scheduling</strong>. Prices are under <strong>Pricing &amp; Payments</strong>.</p>
        {draft && (
          <div className="grid-2">
            <div className="card">
              <div className="eyebrow">Contact details</div>
              {CONTACT.map(renderField)}
            </div>
            <div className="card">
              <div className="eyebrow">Footer</div>
              {FOOTER.map(renderField)}
            </div>
          </div>
        )}
        <EmailCard toast={props.toast} />
      </div>
    </>
  )
}

interface EmailStatus {
  ready: boolean; problems: string[]; from: string | null; notificationsTo: string
  recent: { created_at: string; kind: string; recipient: string | null; subject: string | null; status: string; error: string | null; test_mode: boolean }[]
}
const KIND: Record<string, string> = {
  enrollment_client: 'Enrollment, to client', enrollment_admin: 'Enrollment, to you', resend_copy: 'Resent agreement',
  payment_received: 'Payment received', sprint_purchase: 'Sprint purchase', contact_admin: 'Contact form, to you',
  contact_sender: 'Contact form, to visitor', test: 'Test email',
  sprint_registered: 'Sprint registration, to participant', gift_certificate: 'Sprint gift certificate, to buyer',
  gift_redeemed_recipient: 'Sprint gift claimed, to participant', gift_redeemed_admin: 'Sprint gift claimed, to you',
}

// Email delivery: whether it is set up, a test button, and recent sends
function EmailCard({ toast }: { toast: ViewProps['toast'] }) {
  const [s, setS] = useState<EmailStatus | null>(null)
  const [busy, setBusy] = useState(false)
  const load = () => fetch('/api/admin/email').then(r => (r.ok ? r.json() : null)).then(setS).catch(() => {})
  useEffect(() => { load() }, [])

  async function test() {
    setBusy(true)
    const res = await fetch('/api/admin/email', { method: 'POST' })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (res.ok) toast(`Test email sent to ${data.to}. Check that inbox.`)
    else toast(`The test email was not sent: ${data.error || 'unknown problem'}`, true)
    load()
  }

  if (!s) return null
  return (
    <div className="card">
      <div className="eyebrow">Email delivery</div>
      {s.ready
        ? <div className="notice ok"><strong>Set up.</strong> Emails are sent from {s.from}. Your notifications go to {s.notificationsTo}.</div>
        : <div className="notice warn"><strong>Not set up yet.</strong> Your developer still needs to finish email setup, so enrollment and contact emails are not being sent. Signed agreements are still saved here.</div>}
      <button className="ghost-btn" onClick={test} disabled={busy || !s.ready}>{busy ? 'Sending…' : 'Send a test email to me'}</button>
      {s.recent.length > 0 && (
        <div className="table-wrap" style={{ marginTop: 16 }}>
          <table className="table">
            <thead><tr><th>When</th><th>Email</th><th>To</th><th>Result</th></tr></thead>
            <tbody>
              {s.recent.map((r, i) => (
                <tr key={i}>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(r.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</td>
                  <td>{KIND[r.kind] ?? r.kind}{r.test_mode ? ' (test)' : ''}</td>
                  <td>{r.recipient ?? ''}</td>
                  <td style={{ color: r.status === 'sent' ? '#4ade80' : r.status === 'failed' ? '#f87171' : '#fbbf24' }} title={r.error ?? ''}>
                    {r.status === 'sent' ? 'Sent' : r.status === 'failed' ? 'Failed' : 'Not sent'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
