'use client'

import { useState } from 'react'

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');

        :root {
          --ivory: #F7F4ED;
          --ivory-dark: #EDE8DC;
          --slate: #4C78A0;
          --slate-mid: #3A607F;
          --navy: #0D1B2A;
          --text: #1C2B3A;
          --text-mid: #3D5166;
          --text-muted: #6B7A8D;
          --rule: rgba(28,43,58,0.1);
          --rule-strong: rgba(28,43,58,0.28);
          --error: #b91c1c;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--ivory); color: var(--text); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        .contact-page {
          min-height: 100vh;
          padding: 160px 72px 120px;
          background: var(--ivory);
        }

        .contact-canvas {
          max-width: 1320px;
          width: 100%;
        }

        /* Zone 1 — headline */
        .contact-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(38px, 5vw, 68px);
          font-weight: 400;
          line-height: 1.1;
          color: var(--text);
          letter-spacing: -0.02em;
          max-width: 780px;
        }

        /* Zone 2 — body + primary CTA, offset right */
        .contact-primary {
          margin-top: 48px;
          margin-left: auto;
          max-width: 520px;
        }
        .contact-body {
          font-size: 1rem;
          line-height: 1.82;
          color: var(--text-mid);
          margin-bottom: 32px;
          font-weight: 300;
        }
        .btn-schedule {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 32px;
          background: var(--navy);
          color: var(--ivory);
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.22s;
          cursor: pointer;
          border: none;
        }
        .btn-schedule:hover { background: var(--slate-mid); }

        /* Zone 3 — form + slate panel */
        .contact-lower {
          margin-top: 80px;
          border-top: 1px solid var(--rule);
          padding-top: 64px;
          display: grid;
          grid-template-columns: 560px 1fr 340px;
          align-items: stretch;
        }

        /* Form */
        .form-zone {}
        .field { margin-bottom: 28px; }
        .field label {
          display: block;
          font-size: 0.72rem;
          color: var(--text-mid);
          letter-spacing: 0.04em;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .field input,
        .field textarea {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--rule-strong);
          border-radius: 0;
          color: var(--text);
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 300;
          padding: 10px 0;
          outline: none;
          transition: border-color 0.2s;
          -webkit-appearance: none;
        }
        .field input:focus,
        .field textarea:focus { border-bottom-color: var(--slate); }
        .field input::placeholder,
        .field textarea::placeholder { color: rgba(107,122,141,0.4); font-weight: 300; }
        .field textarea { resize: none; height: 120px; line-height: 1.7; }
        .form-error { font-size: 0.82rem; color: var(--error); margin-bottom: 20px; line-height: 1.5; }
        .form-success { font-size: 0.95rem; color: var(--text-mid); margin-bottom: 24px; line-height: 1.7; }
        .btn-send {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 13px 28px;
          background: var(--navy);
          color: var(--ivory);
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: background 0.22s;
        }
        .btn-send:hover:not(:disabled) { background: var(--slate-mid); }
        .btn-send:disabled { opacity: 0.55; cursor: not-allowed; }

        /* Slate panel */
        .slate-panel {
          background: var(--slate);
          padding: 48px 52px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 40px;
        }
        .details-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1rem;
          font-weight: 400;
          color: rgba(247,244,237,0.9);
          margin-bottom: 14px;
          letter-spacing: -0.01em;
        }
        .details-item {
          font-size: 0.88rem;
          color: rgba(247,244,237,0.55);
          line-height: 2;
          font-weight: 300;
        }
        .details-item a {
          color: rgba(247,244,237,0.55);
          text-decoration: none;
          transition: color 0.2s;
        }
        .details-item a:hover { color: rgba(247,244,237,0.88); }
        .contact-closing {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.4vw, 32px);
          font-weight: 400;
          color: rgba(247,244,237,0.92);
          letter-spacing: -0.01em;
          line-height: 1.25;
        }

        @media (max-width: 1100px) {
          .contact-lower { grid-template-columns: 480px 1fr 280px; }
        }
        @media (max-width: 900px) {
          .contact-page { padding: 140px 48px 100px; }
          .contact-primary { margin-left: 0; max-width: 100%; margin-top: 36px; }
          .contact-lower { grid-template-columns: 1fr; padding-top: 48px; }
          .contact-lower > .gap-col { display: none; }
          .slate-panel { padding: 48px 40px; }
          .contact-closing { font-size: clamp(22px, 5vw, 28px); }
        }
        @media (max-width: 640px) {
          .contact-page { padding: 120px 24px 80px; }
          .contact-headline { font-size: clamp(32px, 9vw, 48px); }
          .slate-panel { padding: 40px 24px; }
        }
      `}</style>

      <div className="contact-page">
        <div className="contact-canvas">

          <h1 className="contact-headline">It starts with a single conversation.</h1>

          <div className="contact-primary">
            <p className="contact-body">Schedule a free 15-minute intro call. No pitch. No pressure. Just a direct conversation about where you are, what you'd like the future to hold — and whether this is the right fit for getting there.</p>
            <a className="btn-schedule" role="button">
              Schedule Your Free Intro Call
            </a>
          </div>

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

            <div className="gap-col" />

            <div className="slate-panel">
              <div>
                <div className="details-name">John McCracken, EMBA, ACC (ICF)</div>
                <div className="details-item">
                  <a href="mailto:john@mccrackencoaching.com">john@mccrackencoaching.com</a>
                </div>
                <div className="details-item">
                  <a href="tel:7037052225">703-705-2225</a>
                </div>
                <div className="details-item">Washington, DC area | Virtual worldwide</div>
              </div>
              <div className="contact-closing">Together we get Beyond your Horizon.</div>
            </div>

          </div>

        </div>
      </div>
    </>
  )
}