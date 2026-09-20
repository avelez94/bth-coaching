'use client'

import { useEffect, useState } from 'react'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const services = [
    { label: 'Executive Coaching', href: '/executive-coaching' },
    { label: 'Transition Coaching', href: '/transition-coaching' },
    { label: 'Mission-Ready Leadership', href: '/mission-ready-leadership' },
    { label: 'Leadership Consulting', href: '/leadership-consulting' },
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
          gap: 28px;
          align-items: center;
        }

        .nav-link,
        .services-trigger {
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          color: #6B7A8D;
          text-decoration: none;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: color 0.2s;
          font-weight: 500;
          white-space: nowrap;
        }

        .nav-link:hover,
        .services-trigger:hover {
          color: #0D1B2A;
        }

        .services-wrap {
          position: relative;
        }

        .services-trigger {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 12px 0;
        }

        .services-chevron {
          font-size: 0.65rem;
          transition: transform 0.2s ease;
        }

        .services-chevron.open {
          transform: rotate(180deg);
        }

        .services-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 50%;
          transform: translateX(-50%);
          width: 250px;
          padding: 10px 0;
          background: #F7F4ED;
          border: 1px solid rgba(13,27,42,0.1);
          box-shadow: 0 14px 40px rgba(13,27,42,0.1);
        }

        .services-dropdown a {
          display: block;
          padding: 12px 20px;
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          color: #3D5166;
          text-decoration: none;
          letter-spacing: 0.03em;
          transition: background 0.2s, color 0.2s;
        }

        .services-dropdown a:hover {
          background: #EDE8DC;
          color: #0D1B2A;
        }

        .nav-cta {
          background: #0D1B2A;
          color: #F7F4ED;
          padding: 12px 24px;
          font-family: 'Inter', sans-serif;
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.3s;
          font-weight: 500;
          white-space: nowrap;
        }

        .nav-cta:hover {
          background: #C9A23A;
          color: #0D1B2A;
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

        .mobile-services-label {
          margin-top: 6px;
          font-family: 'Inter', sans-serif;
          font-size: 0.65rem;
          color: #6B7A8D;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .nav-mobile-cta {
          margin-top: 10px;
          background: #0D1B2A;
          color: #F7F4ED !important;
          padding: 16px 40px;
          font-size: 0.78rem !important;
          font-family: 'Inter', sans-serif !important;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 500 !important;
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

        @media (max-width: 1100px) {
          .nav-inner { padding: 16px 40px; }
          .nav-links { gap: 20px; }
          .nav-link, .services-trigger { font-size: 0.65rem; }
        }

        @media (max-width: 900px) {
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
            <a href="/about" className="nav-link">About</a>

            <div
              className="services-wrap"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className="services-trigger"
                onClick={() => setServicesOpen(!servicesOpen)}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                Services
                <span className={`services-chevron ${servicesOpen ? 'open' : ''}`}>▾</span>
              </button>

              {servicesOpen && (
                <div className="services-dropdown">
                  {services.map((service) => (
                    <a key={service.href} href={service.href}>{service.label}</a>
                  ))}
                </div>
              )}
            </div>

            <a href="/the-framework" className="nav-link">The Framework</a>
            <a href="/contact" className="nav-link">Contact</a>
          </div>

          <a href="/contact" className="nav-cta">Schedule a Conversation</a>

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

        <a href="/about" onClick={() => setMenuOpen(false)}>About</a>
        <div className="mobile-services-label">Services</div>
        {services.map((service) => (
          <a key={service.href} href={service.href} onClick={() => setMenuOpen(false)}>
            {service.label}
          </a>
        ))}
        <a href="/the-framework" onClick={() => setMenuOpen(false)}>The Framework</a>
        <a href="/contact" onClick={() => setMenuOpen(false)}>Contact</a>
        <a href="/contact" className="nav-mobile-cta" onClick={() => setMenuOpen(false)}>
          Schedule a Conversation
        </a>
      </div>
    </>
  )
}