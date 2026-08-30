'use client'

import { useEffect, useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

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
      if (!res.ok) throw new Error('Failed to send')
      setSent(true)
      setForm({ name: '', email: '', phone: '', interest: '', message: '' })
    } catch {
      setError('Something went wrong. Please try again or email john@mccrackencoaching.com directly.')
    }
    setSending(false)
  }

  return (
    <>
      <style>{`
        :root {
          --navy: #0D1B2A; --navy-mid: #1A2E45; --slate: #4C78A0;
          --gold: #C9A23A; --gold-light: #D4B563;
          --ivory: #F7F4ED; --ivory-dark: #EDE8DC;
          --white: #FFFFFF; --text-body: #2C3E50; --text-muted: #6B7A8D;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--ivory); color: var(--navy); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; }
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .reveal.delay-1 { transition-delay: 0.1s; } .reveal.delay-2 { transition-delay: 0.2s; } .reveal.delay-3 { transition-delay: 0.3s; }
        .reveal.revealed { opacity: 1; transform: translateY(0); }

        .page-hero { min-height: 50vh; background: var(--navy); display: flex; align-items: center; position: relative; overflow: hidden; }
        .page-hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, var(--navy) 0%, #1A2E45 100%); }
        .page-hero-pattern { position: absolute; inset: 0; opacity: 0.04; background-image: repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%); background-size: 30px 30px; }
        .page-hero-content { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 160px 60px 80px; width: 100%; }
        .page-eyebrow { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .page-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--gold); }
        .page-hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(44px, 6vw, 80px); font-weight: 600; line-height: 1.05; color: var(--white); margin-bottom: 20px; }
        .page-hero-title em { font-style: italic; color: var(--gold); }
        .page-hero-desc { font-size: 1rem; line-height: 1.8; color: rgba(247,244,237,0.6); max-width: 520px; }

        .contact-section { padding: 100px 60px; background: var(--ivory); }
        .contact-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.4fr; gap: 80px; align-items: start; }
        .contact-info { }
        .eyebrow { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 4vw, 48px); font-weight: 600; line-height: 1.1; color: var(--navy); margin-bottom: 20px; }
        .section-title em { font-style: italic; color: var(--slate); }
        .body-text { font-size: 0.95rem; line-height: 1.85; color: var(--text-body); margin-bottom: 40px; }
        .contact-details { display: flex; flex-direction: column; gap: 24px; margin-bottom: 48px; }
        .contact-detail { display: flex; align-items: flex-start; gap: 16px; }
        .detail-icon { width: 40px; height: 40px; background: var(--navy); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.9rem; }
        .detail-content { }
        .detail-label { font-size: 0.65rem; color: var(--gold); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; margin-bottom: 4px; }
        .detail-value { font-size: 0.9rem; color: var(--navy); }
        .detail-value a { color: var(--navy); text-decoration: none; transition: color 0.2s; }
        .detail-value a:hover { color: var(--gold); }
        .availability-box { background: var(--navy); padding: 32px; }
        .avail-title { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 600; color: var(--white); margin-bottom: 16px; }
        .avail-text { font-size: 0.85rem; line-height: 1.7; color: rgba(247,244,237,0.55); }

        .contact-form { background: var(--white); padding: 48px 44px; box-shadow: 0 8px 40px rgba(13,27,42,0.06); }
        .form-title { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 600; color: var(--navy); margin-bottom: 8px; }
        .form-sub { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 36px; line-height: 1.6; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group.full { grid-column: 1 / -1; }
        .form-label { font-size: 0.7rem; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; }
        .form-input { background: var(--ivory); border: 1px solid rgba(13,27,42,0.12); color: var(--navy); font-family: 'Inter', sans-serif; font-size: 0.9rem; padding: 14px 16px; outline: none; transition: border-color 0.2s; width: 100%; }
        .form-input:focus { border-color: var(--gold); }
        .form-input::placeholder { color: rgba(107,122,141,0.5); }
        select.form-input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7A8D' stroke-width='1.5' fill='none'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; padding-right: 40px; }
        textarea.form-input { resize: vertical; min-height: 140px; line-height: 1.6; }
        .form-error { font-size: 0.8rem; color: #c0392b; margin-bottom: 16px; }
        .form-success { background: rgba(39,174,96,0.08); border: 1px solid rgba(39,174,96,0.2); padding: 20px 24px; margin-bottom: 24px; }
        .form-success-title { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600; color: #27ae60; margin-bottom: 6px; }
        .form-success-text { font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; }
        .btn-submit { width: 100%; background: var(--navy); color: var(--ivory); border: none; padding: 18px; font-family: 'Inter', sans-serif; font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 500; cursor: pointer; transition: all 0.3s; margin-top: 8px; }
        .btn-submit:hover:not(:disabled) { background: var(--gold); color: var(--navy); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .scheduling { padding: 100px 60px; background: var(--navy); }
        .scheduling-inner { max-width: 1200px; margin: 0 auto; }
        .scheduling-header { text-align: center; margin-bottom: 64px; }
        .eyebrow-light { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; justify-content: center; }
        .eyebrow-light::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .section-title-light { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 4vw, 52px); font-weight: 600; line-height: 1.08; color: var(--white); }
        .section-title-light em { font-style: italic; color: var(--gold); }
        .calendar-placeholder { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 80px 40px; text-align: center; }
        .calendar-placeholder-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 600; color: var(--white); margin-bottom: 12px; }
        .calendar-placeholder-text { font-size: 0.88rem; color: rgba(247,244,237,0.45); line-height: 1.7; margin-bottom: 28px; }
        .btn-gold { background: var(--gold); color: var(--navy); display: inline-flex; align-items: center; gap: 10px; padding: 16px 36px; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: all 0.3s; font-weight: 500; }
        .btn-gold:hover { background: var(--gold-light); transform: translateY(-2px); }

        @media (max-width: 900px) {
          .page-hero-content { padding: 140px 24px 60px; }
          .contact-section { padding: 72px 24px; }
          .contact-inner { grid-template-columns: 1fr; gap: 48px; }
          .scheduling { padding: 72px 24px; }
          .contact-form { padding: 32px 24px; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-pattern" />
        <div className="page-hero-content">
          <div className="page-eyebrow">Get in Touch</div>
          <h1 className="page-hero-title">Let's start a<br /><em>conversation.</em></h1>
          <p className="page-hero-desc">Whether you are ready to get started or just exploring what coaching might look like, reach out. The first conversation is always complimentary.</p>
        </div>
      </div>

      <section className="contact-section">
        <div className="contact-inner">
          <div className="contact-info">
            <div className="eyebrow reveal">Contact</div>
            <h2 className="section-title reveal delay-1">Reach out<br /><em>directly.</em></h2>
            <p className="body-text reveal delay-2">Fill out the form and I will be in touch within one business day. You can also reach me directly by phone or email.</p>
            <div className="contact-details reveal delay-3">
              <div className="contact-detail">
                <div className="detail-icon">📧</div>
                <div className="detail-content">
                  <div className="detail-label">Email</div>
                  <div className="detail-value"><a href="mailto:john@mccrackencoaching.com">john@mccrackencoaching.com</a></div>
                </div>
              </div>
              <div className="contact-detail">
                <div className="detail-icon">📞</div>
                <div className="detail-content">
                  <div className="detail-label">Phone</div>
                  <div className="detail-value"><a href="tel:7033436960">703.343.6960</a></div>
                </div>
              </div>
              <div className="contact-detail">
                <div className="detail-icon">🌐</div>
                <div className="detail-content">
                  <div className="detail-label">Website</div>
                  <div className="detail-value">mccrackencoaching.com</div>
                </div>
              </div>
            </div>
            <div className="availability-box reveal delay-4">
              <div className="avail-title">Current availability</div>
              <p className="avail-text">I am currently accepting new individual and business coaching clients. Discovery calls are available Monday through Friday. Use the form or schedule directly using the calendar below.</p>
            </div>
          </div>

          <div className="contact-form reveal delay-2">
            <div className="form-title">Send a message</div>
            <div className="form-sub">Tell me a bit about yourself and what you are looking for. I will follow up within one business day.</div>

            {sent && (
              <div className="form-success">
                <div className="form-success-title">Message sent.</div>
                <div className="form-success-text">Thank you for reaching out. I will be in touch within one business day.</div>
              </div>
            )}

            {error && <div className="form-error">{error}</div>}

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full name *</label>
                <input className="form-input" type="text" placeholder="Your full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Email address *</label>
                <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone number</label>
                <input className="form-input" type="tel" placeholder="Optional" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">I am interested in</label>
                <select className="form-input" value={form.interest} onChange={e => setForm({...form, interest: e.target.value})}>
                  <option value="">Select an option</option>
                  <option value="Business Coaching">Business Coaching</option>
                  <option value="Individual Coaching">Individual Coaching</option>
                  <option value="Executive Leadership">Executive Leadership</option>
                  <option value="Strategic Consulting">Strategic Consulting</option>
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </div>
              <div className="form-group full">
                <label className="form-label">Tell me about your situation *</label>
                <textarea className="form-input" placeholder="Share a bit about where you are and what you are looking for..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
              </div>
            </div>
            <button className="btn-submit" onClick={handleSubmit} disabled={sending}>
              {sending ? 'Sending...' : 'Send Message →'}
            </button>
          </div>
        </div>
      </section>

      <section className="scheduling">
        <div className="scheduling-inner">
          <div className="scheduling-header">
            <div className="eyebrow-light">Schedule Directly</div>
            <h2 className="section-title-light">Book a discovery call <em>online.</em></h2>
          </div>
          <div className="calendar-placeholder">
            <div className="calendar-placeholder-title">Outlook Calendar Scheduling</div>
            <p className="calendar-placeholder-text">Online scheduling is coming soon. In the meantime, reach out via the contact form above or call directly at 703.343.6960 to schedule a complimentary discovery call.</p>
            <a href="mailto:john@mccrackencoaching.com?subject=Discovery Call Request" className="btn-gold">Request a Discovery Call →</a>
          </div>
        </div>
      </section>
    </>
  )
}