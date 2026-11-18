'use client'

import { useState } from 'react'
import './contact.css'
import ScheduleButton from '../../components/schedule-button'
import { telHref } from '@/lib/site-settings'
import type { ViewProps } from '@/lib/view-props'

export default function ContactView({ c, booking, contact }: ViewProps) {
  const email = contact?.email ?? 'john@mccrackencoaching.com'
  const phone = contact?.phone ?? '703-705-2225'
  const location = contact?.location ?? 'Washington, DC area | Virtual worldwide'
  const [form, setForm] = useState({ name: '', email: '', organization: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in your name, email, and message.')
      return
    }
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      setSent(true)
      setForm({ name: '', email: '', organization: '', message: '' })
    } catch {
      setError(`Something went wrong. Please try again or email ${email} directly.`)
    }
    setSending(false)
  }

  return (
    <>
      {/* ===== UPPER: ivory zone — headline, intro, form/contact ===== */}
      <div className="contact-page">
        <div className="contact-canvas">

          <h1 className="contact-headline">{c['top.headline']}</h1>

          <div className="contact-primary">
            <div className="contact-cta-row">
              <ScheduleButton url={booking?.free} className="btn btn-gold" disabledStyle={{opacity: 0.72, cursor: 'not-allowed'}}>
                Schedule a Free 15-Minute Call
              </ScheduleButton>
              <ScheduleButton url={booking?.org} className="btn btn-outline" disabledStyle={{opacity: 0.72, cursor: 'not-allowed'}}>
                Schedule an Organizational Consultation
              </ScheduleButton>
            </div>
            <p className="contact-body">{c['top.body']}</p>
            <a href="/faq" className="contact-faq-link">{c['top.faqLink']}</a>
          </div>

          {/* ===== FORM + CONTACT MODULE ===== */}
          <div className="contact-lower">

            <div className="form-zone">
              {sent ? (
                <p className="form-success">{c['form.success']}</p>
              ) : (
                <>
                  {error && <div className="form-error">{error}</div>}
                  <div className="field">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      autoComplete="name"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      autoComplete="email"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="organization">Organization <span className="field-optional">(optional)</span></label>
                    <input
                      id="organization"
                      type="text"
                      placeholder="Your organization"
                      value={form.organization}
                      onChange={e => setForm({ ...form, organization: e.target.value })}
                      autoComplete="organization"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                    />
                  </div>
                  <button
                    className="btn-send"
                    onClick={handleSubmit}
                    disabled={sending}
                  >
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </>
              )}
            </div>

            <div className="contact-right-col">
              <div className="contact-photo-col">
                <img
                  src={c['details.image']}
                  alt="John McCracken"
                  className="contact-photo-img"
                />
              </div>
              <div className="slate-panel">
                <div className="details-name">{c['details.name']}</div>
                <div className="details-item">
                  <a href={`mailto:${email}`}>{email}</a>
                </div>
                <div className="details-item">
                  <a href={telHref(phone)}>{phone}</a>
                </div>
                <div className="details-item">{location}</div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ===== CLOSING: full-width slate section ===== */}
      <section className="contact-closing">
        <div className="contact-closing-inner">
          <p className="contact-closing-statement">{c['closing.body']}</p>
          <img
            src="/images/john-mccracken-signature.png"
            alt="John McCracken signature"
            className="contact-closing-signature"
            aria-hidden="true"
          />
          <ScheduleButton url={booking?.main} className="btn-closing-schedule">
            Schedule a Free 15-Minute Call
          </ScheduleButton>
        </div>
      </section>
    </>
  )
}
