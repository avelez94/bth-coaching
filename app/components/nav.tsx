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
    { label: 'Home', href: '/' },
    { label: 'Executive Coaching', href: '/executive-coaching' },
    { label: 'Leader Development', href: '/leader-development' },
    { label: 'For Organizations', href: '/for-organizations' },
    { label: 'Sample Engagements', href: '/sample-engagements' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@300;400;500;600&display=swap');

        .nav-wrap {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(13,27,42,0.1);
          transition: background 0.3s;
        }

        .nav-inner {
          max-width: 1320px;
          margin: 0 auto;
          padding: 5px 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-brand {
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .nav-brand img {
          height: 70px;
          width: auto;
          display: block;
        }

        .nav-links {
          display: flex;
          gap: 24px;
          align-items: center;
        }

        .nav-link {
          font-family: 'Inter', sans-serif;
          font-size: 0.68rem;
          color: #6B7A8D;
          text-decoration: none;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: color 0.2s;
          font-weight: 500;
          white-space: nowrap;
        }

        .nav-link:hover {
          color: #0D1B2A;
        }

        /* PLACEHOLDER: Replace disabled button with <a> once Microsoft Bookings URL is provided */
        .nav-cta {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 12px 24px;
          background: #C9A23A;
          color: #0D1B2A;
          font-family: 'Inter', sans-serif;
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 500;
          border: none;
          white-space: nowrap;
          cursor: not-allowed;
          opacity: 0.72;
        }

        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 4px;
          background: none;
          border: none;
        }

        .nav-hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: #0D1B2A;
        }

        .nav-mobile {
          display: none;
          position: fixed;
          inset: 0;
          background: #F7F4ED;
          z-index: 99;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          overflow-y: auto;
          padding: 80px 24px 40px;
        }

        .nav-mobile.open {
          display: flex;
        }

        .nav-mobile-logo {
          margin-bottom: 8px;
        }

        .nav-mobile-logo img {
          height: 40px;
          width: auto;
        }

        .nav-mobile a {
          font-size: 1.15rem;
          color: #0D1B2A;
          text-decoration: none;
          font-family: 'DM Serif Display', serif;
          font-weight: 400;
          text-align: center;
        }

        /* PLACEHOLDER: Replace disabled button with <a> once Microsoft Bookings URL is provided */
        .nav-mobile-cta {
          margin-top: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 40px;
          background: #C9A23A;
          color: #0D1B2A;
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 500;
          border: none;
          cursor: not-allowed;
          opacity: 0.72;
          width: 100%;
          max-width: 320px;
        }

        .nav-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #0D1B2A;
        }

        @media (max-width: 1200px) {
          .nav-inner { padding: 5px 40px; }
          .nav-links { gap: 16px; }
          .nav-link { font-size: 0.62rem; }
        }

        @media (max-width: 1000px) {
          .nav-inner { padding: 16px 24px; }
          .nav-links, .nav-cta { display: none; }
          .nav-hamburger { display: flex; }
        }
      `}</style>

      <div
        className="nav-wrap"
        style={{
          background: scrolled ? 'rgba(247,244,237,0.98)' : 'rgba(247,244,237,0.95)',
        }}
      >
        <div className="nav-inner">
          <a href="/" className="nav-brand">
            <img src="/images/bth-logo-nav.png" alt="Beyond the Horizon" />
          </a>

          <div className="nav-links">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">{link.label}</a>
            ))}
          </div>

          {/* PLACEHOLDER: Replace with <a href="{bookingsUrl}" target="_blank"> once Microsoft Bookings URL is provided */}
          <button className="nav-cta" disabled aria-disabled="true">
            Schedule a Free 15-Minute Call
          </button>

          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`nav-mobile ${menuOpen ? 'open' : ''}`}>
        <button className="nav-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>

        <div className="nav-mobile-logo">
          <img src="/images/bth-logo-nav.png" alt="Beyond the Horizon" />
        </div>

        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
        ))}

        {/* PLACEHOLDER: Replace with <a href="{bookingsUrl}" target="_blank"> once Microsoft Bookings URL is provided */}
        <button className="nav-mobile-cta" disabled aria-disabled="true">
          Schedule a Free 15-Minute Call
        </button>
      </div>
    </>
  )
}
