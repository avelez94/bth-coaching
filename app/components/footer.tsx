export default function Footer() {
  return (
    <>
      <style>{`
        .footer { background: #0D1B2A; padding: 80px 72px 40px; border-top: 1px solid rgba(201,162,58,0.12); }
        .footer-inner { max-width: 1320px; margin: 0 auto; }
        .footer-top { display: grid; grid-template-columns: 1.8fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }
        .footer-brand img { height: 52px; width: auto; display: block; margin-bottom: 20px; }
        .footer-desc { font-size: 0.82rem; line-height: 1.75; color: rgba(247,244,237,0.35); max-width: 280px; }
        .footer-col-title { font-size: 0.6rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; margin-bottom: 20px; }
        .footer-col a { display: block; font-size: 0.82rem; color: rgba(247,244,237,0.45); text-decoration: none; margin-bottom: 12px; transition: color 0.2s; }
        .footer-col a:hover { color: #fff; }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 28px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .footer-copy { font-size: 0.75rem; color: rgba(247,244,237,0.25); }
        .footer-credit { font-size: 0.75rem; color: rgba(247,244,237,0.25); }
        .footer-credit a { color: rgba(247,244,237,0.4); text-decoration: none; transition: color 0.2s; }
        .footer-credit a:hover { color: #C9A23A; }
        @media (max-width: 1024px) { .footer { padding: 60px 40px 32px; } .footer-top { grid-template-columns: 1fr 1fr; gap: 40px; } }
        @media (max-width: 640px) { .footer { padding: 60px 24px 32px; } .footer-top { grid-template-columns: 1fr; gap: 32px; } .footer-bottom { flex-direction: column; align-items: flex-start; } }
      `}</style>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="/"><img src="/images/bth-logo-footer.png" alt="Beyond the Horizon" /></a>
              <p className="footer-desc">Whole-person coaching for accomplished leaders who want clarity about what's next — and the support to actually move toward it.</p>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Coaching</div>
              <a href="/executive-coaching">Executive Coaching</a>
              <a href="/transition-coaching">Transition Coaching</a>
              <a href="/mission-ready-leadership">Mission-Ready Leadership</a>
              <a href="/leadership-consulting">Leadership Consulting</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Company</div>
              <a href="/about">About John</a>
              <a href="/the-framework">The Framework</a>
              <a href="/contact">Contact</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Get in Touch</div>
              <a href="mailto:john@mccrackencoaching.com">john@mccrackencoaching.com</a>
              <a href="tel:7037052225">703-705-2225</a>
              <a href="/contact">Schedule a Conversation</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2026 Beyond the Horizon Executive Coaching and Consulting, LLC. All rights reserved.</div>
            <div className="footer-credit">Made with <span style={{color:'#C9A23A'}}>♥</span> by <a href="https://alantevelez.com" target="_blank" rel="noopener noreferrer">Alante Velez</a></div>
          </div>
        </div>
      </footer>
    </>
  )
}