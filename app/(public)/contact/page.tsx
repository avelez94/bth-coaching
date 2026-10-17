'use client'

import { useState } from 'react'
import './contact.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
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
      setForm({ name: '', email: '', message: '' })
    } catch {
      setError('Something went wrong. Please try again or email john@mccrackencoaching.com directly.')
    }
    setSending(false)
  }

  return (
    <>
      {/* ===== UPPER: ivory zone — headline, intro, form/contact ===== */}
      <div className="contact-page">
        <div className="contact-canvas">

          <h1 className="contact-headline">It starts with a single conversation.</h1>

          <div className="contact-primary">
            <p className="contact-body">A free 15-minute call. No pitch, no pressure. Just a direct conversation about where you are, where you want to go, and whether we're the right fit to get you there.</p>

            <p className="org-path">
              Prefer to start with a consultation?{' '}
              {/* PENDING ORGANIZATIONAL MICROSOFT BOOKINGS URL */}
              <button className="org-path-placeholder" disabled aria-disabled="true">
                Schedule an Organizational Consultation
              </button>
            </p>
          </div>

          {/* ===== FORM + CONTACT MODULE ===== */}
          <div className="contact-lower">

            <div className="form-zone">
              {sent ? (
                <p className="form-success">Thank you. Your message has been sent.</p>
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
                  src="/images/9Contact.jpeg"
                  alt="John McCracken"
                  className="contact-photo-img"
                />
              </div>
              <div className="slate-panel">
                <div className="details-name">John McCracken, CAPT, USN (Ret.), ACC</div>
                <div className="details-item">
                  <a href="mailto:john@mccrackencoaching.com">john@mccrackencoaching.com</a>
                </div>
                <div className="details-item">
                  <a href="tel:7037052225">703-705-2225</a>
                </div>
                <div className="details-item">Washington, DC area | Virtual worldwide</div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ===== CLOSING: full-width slate section ===== */}
      <section className="contact-closing">
        <div className="contact-closing-inner">
          <p className="contact-closing-statement">I believe setbacks don't define people; what they do next does. Thirty-seven years of leading, and sometimes failing, taught me that lasting results come from developing the whole person, not just the work version of who they are. If that's the growth you want for yourself or your team, let's take 15 minutes to chart a path forward.</p>
          <img
            src="/images/john-mccracken-signature.png"
            alt="John McCracken signature"
            className="contact-closing-signature"
            aria-hidden="true"
          />
          {/* PENDING MICROSOFT BOOKINGS URL */}
          <button
            className="btn-closing-schedule"
            disabled
            aria-disabled="true"
          >
            Schedule a Free 15-Minute Call
          </button>
          <div className="contact-closing-details">
            <a href="mailto:john@mccrackencoaching.com">john@mccrackencoaching.com</a>
            <span className="contact-closing-sep">·</span>
            <a href="tel:7037052225">703-705-2225</a>
          </div>
        </div>
      </section>
    </>
  )
}
