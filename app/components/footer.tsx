'use client'

export default function Footer() {
  const links = {
    Services: [
      { label: 'Business Coaching', href: '/business' },
      { label: 'Individual Coaching', href: '/individual' },
      { label: 'Executive Leadership', href: '/contact' },
      { label: 'Strategic Consulting', href: '/contact' },
    ],
    Company: [
      { label: 'About John', href: '/' },
      { label: 'Contact', href: '/contact' },
    ],
    Contact: [
      { label: 'john@mccrackencoaching.com', href: 'mailto:john@mccrackencoaching.com' },
      { label: '703.343.6960', href: 'tel:7033436960' },
    ],
  }

  return (
    <>
      <style>{`
        .footer { background: #0D1B2A; padding: 80px 60px 40px; border-top: 1px solid rgba(201,162,58,0.15); }
        .footer-inner { max-width: 1200px; margin: 0 auto; }
        .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }
        .footer-brand-name { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .footer-brand-sub { font-size: 0.65rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 20px; }
        .footer-desc { font-size: 0.82rem; line-height: 1.75; color: rgba(247,244,237,0.35); }
        .footer-col-title { font-size: 0.65rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; margin-bottom: 20px; }
        .footer-col a { display: block; font-size: 0.82rem; color: rgba(247,244,237,0.45); text-decoration: none; margin-bottom: 12px; transition: color 0.2s; word-break: break-word; }
        .footer-col a:hover { color: #fff; }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 28px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .footer-copy { font-size: 0.75rem; color: rgba(247,244,237,0.25); }
        .footer-credit { font-size: 0.75rem; color: rgba(247,244,237,0.25); }
        .footer-credit a { color: rgba(247,244,237,0.4); text-decoration: none; transition: color 0.2s; }
        .footer-credit a:hover { color: #C9A23A; }
        .footer-gold-line { width: 40px; height: 2px; background: #C9A23A; opacity: 0.4; }
        @media (max-width: 900px) {
          .footer { padding: 60px 24px 32px; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
        }
        @media (max-width: 540px) {
          .footer-grid { grid-template-columns: 1fr; gap: 32px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
          .footer-gold-line { display: none; }
        }
      `}</style>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div className="footer-brand-name">Beyond the Horizon</div>
              <div className="footer-brand-sub">Executive Coaching and Consulting</div>
              <p className="footer-desc">Strategic coaching and consulting for leaders who are ready to navigate change, unlock potential, and create lasting impact.</p>
            </div>
            {Object.entries(links).map(([title, items]) => (
              <div key={title} className="footer-col">
                <div className="footer-col-title">{title}</div>
                {items.map(item => (
                  <a key={item.href} href={item.href}>{item.label}</a>
                ))}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2026 Beyond the Horizon Executive Coaching and Consulting. All rights reserved.</div>
            <div className="footer-credit">Made with <span style={{color:'#C9A23A'}}>♥</span> by <a href="https://alantevelez.com" target="_blank" rel="noopener noreferrer">Alante Velez</a></div>
            <div className="footer-gold-line" />
          </div>
        </div>
      </footer>
    </>
  )
}