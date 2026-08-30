'use client'

import { useEffect, useState } from 'react'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { label: 'Business Coaching', href: '/business' },
    { label: 'Individual Coaching', href: '/individual' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        .nav-wrap { position: fixed; top: 0; left: 0; right: 0; z-index: 100; backdrop-filter: blur(12px); border-bottom: 1px solid rgba(13,27,42,0.1); transition: background 0.3s; }
        .nav-inner { max-width: 1320px; margin: 0 auto; padding: 20px 60px; display: flex; justify-content: space-between; align-items: center; }
        .nav-brand { text-decoration: none; }
        .nav-brand-name { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 700; color: #0D1B2A; letter-spacing: 0.04em; line-height: 1.1; }
        .nav-brand-sub { font-size: 0.6rem; color: #C9A23A; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 500; }
        .nav-links { display: flex; gap: 36px; align-items: center; }
        .nav-link { font-size: 0.75rem; color: #6B7A8D; text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase; transition: color 0.2s; font-weight: 500; }
        .nav-link:hover { color: #0D1B2A; }
        .nav-cta { background: #0D1B2A; color: #F7F4ED; padding: 12px 28px; font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: all 0.3s; font-weight: 500; white-space: nowrap; }
        .nav-cta:hover { background: #C9A23A; color: #0D1B2A; }
        .nav-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; background: none; border: none; }
        .nav-hamburger span { display: block; width: 24px; height: 2px; background: #0D1B2A; transition: all 0.3s; }
        .nav-mobile { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #F7F4ED; z-index: 99; flex-direction: column; align-items: center; justify-content: center; gap: 32px; }
        .nav-mobile.open { display: flex; }
        .nav-mobile a { font-size: 1.4rem; color: #0D1B2A; text-decoration: none; font-family: 'Playfair Display', serif; font-weight: 700; }
        .nav-mobile-cta { background: #0D1B2A; color: #F7F4ED !important; padding: 16px 40px; font-size: 0.85rem !important; font-family: 'Inter', sans-serif !important; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500 !important; }
        .nav-close { position: absolute; top: 24px; right: 24px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #0D1B2A; }
        @media (max-width: 900px) {
          .nav-inner { padding: 16px 24px; }
          .nav-links { display: none; }
          .nav-cta { display: none; }
          .nav-hamburger { display: flex; }
        }
      `}</style>
      <div className="nav-wrap" style={{background: scrolled ? 'rgba(247,244,237,0.98)' : 'rgba(247,244,237,0.95)'}}>
        <div className="nav-inner">
          <a href="/" className="nav-brand">
            <div className="nav-brand-name">Beyond the Horizon</div>
            <div className="nav-brand-sub">Executive Coaching and Consulting</div>
          </a>
          <div className="nav-links">
            {links.map(l => <a key={l.href} href={l.href} className="nav-link">{l.label}</a>)}
          </div>
          <a href="/contact" className="nav-cta">Schedule a Session</a>
          <button className="nav-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`nav-mobile ${menuOpen ? 'open' : ''}`}>
        <button className="nav-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>
        {links.map(l => (
          <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
        ))}
        <a href="/contact" className="nav-mobile-cta" onClick={() => setMenuOpen(false)}>Schedule a Session</a>
      </div>
    </>
  )
}