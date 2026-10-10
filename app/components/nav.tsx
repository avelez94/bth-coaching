'use client'

import { useEffect, useState } from 'react'
import './nav.css'

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
