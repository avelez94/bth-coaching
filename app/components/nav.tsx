'use client'

import { useEffect, useRef, useState } from 'react'
import './nav.css'
import ScheduleButton from './schedule-button'
import { DEFAULT_VISIBILITY, OPTIONAL_PAGES, type PageVisibility } from '@/lib/optional-pages'
import { DEFAULT_SETTINGS } from '@/lib/site-settings'

type Link = { label: string; href: string }

const DEFAULT_QUOTE = { text: DEFAULT_SETTINGS.navQuote, by: DEFAULT_SETTINGS.navQuoteAttribution }

export default function Nav({ bookingUrl, visible = DEFAULT_VISIBILITY, quote = DEFAULT_QUOTE }: { bookingUrl?: string; visible?: PageVisibility; quote?: { text: string; by: string } }) {
  const quoteText = quote.text.trim()
  const quoteBy = quote.by.trim()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  // Publish the real heights so page content always clears the fixed header,
  // whatever the browser, zoom, font rendering, or screen size.
  // --nav-h is the navigation row (pages are laid out against it);
  // --quote-h is the quote strip below it, which shifts <main> down.
  useEffect(() => {
    const el = navRef.current
    const row = el?.querySelector('.nav-inner')
    if (!el || !row) return
    const set = () => {
      const total = Math.ceil(el.getBoundingClientRect().height)
      const nav = Math.ceil(row.getBoundingClientRect().height) + 1
      const root = document.documentElement.style
      root.setProperty('--nav-h', `${nav}px`)
      root.setProperty('--quote-h', `${Math.max(0, total - nav)}px`)
    }
    set()
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Optional pages (Page Status in the admin) appear only while Active
  const sprint: Link[] = visible.sprint ? [{ label: OPTIONAL_PAGES.sprint.label, href: OPTIONAL_PAGES.sprint.path }] : []
  const faq: Link[] = [{ label: 'FAQ', href: '/faq' }]

  // Mobile menu keeps all individual links (no nested dropdown)
  const mobileLinks: Link[] = [
    { label: 'Home', href: '/' },
    { label: 'Executive Coaching', href: '/executive-coaching' },
    { label: 'Leader Development', href: '/leader-development' },
    ...sprint,
    { label: 'For Organizations', href: '/for-organizations' },
    { label: 'Sample Engagements', href: '/sample-engagements' },
    { label: 'The 8 Pillars', href: '/the-8-pillars' },
    { label: 'About', href: '/about' },
    ...faq,
    { label: 'Contact', href: '/contact' },
  ]

  const serviceLinks: Link[] = [
    { label: 'Executive Coaching', href: '/executive-coaching' },
    { label: 'Leader Development', href: '/leader-development' },
    ...sprint,
    { label: 'For Organizations', href: '/for-organizations' },
    { label: 'Sample Engagements', href: '/sample-engagements' },
    { label: 'divider', href: '' },
    { label: 'The 8 Pillars', href: '/the-8-pillars' },
  ]

  return (
    <>
      <div
        ref={navRef}
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
            <a href="/" className="nav-link">Home</a>

            {/* Services dropdown */}
            <div className="nav-dropdown">
              <button className="nav-dropdown-trigger" aria-haspopup="true">
                Services
                <span className="nav-dropdown-chevron" aria-hidden="true" />
              </button>
              <div className="nav-dropdown-menu" role="menu">
                {serviceLinks.map((link, i) =>
                  link.label === 'divider' ? (
                    <div key={`divider-${i}`} className="nav-dropdown-divider" role="separator" />
                  ) : (
                    <a key={link.href} href={link.href} className="nav-dropdown-item" role="menuitem">
                      {link.label}
                    </a>
                  )
                )}
              </div>
            </div>

            <a href="/about" className="nav-link">About</a>
            {faq.map(l => <a key={l.href} href={l.href} className="nav-link">{l.label}</a>)}
            <a href="/contact" className="nav-link">Contact</a>
          </div>

          <ScheduleButton url={bookingUrl} className="nav-cta">
            Schedule a Free 15-Minute Call
          </ScheduleButton>

          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Quote strip under the navigation row (Admin > Site Settings) */}
        {quoteText && (
          <figure className="nav-quote">
            <blockquote>&ldquo;{quoteText}&rdquo;</blockquote>
            {quoteBy && <figcaption>{quoteBy}</figcaption>}
          </figure>
        )}
      </div>

      <div className={`nav-mobile ${menuOpen ? 'open' : ''}`}>
        <button className="nav-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>

        <div className="nav-mobile-logo">
          <img src="/images/bth-logo-nav.png" alt="Beyond the Horizon" />
        </div>

        {mobileLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
        ))}

        <ScheduleButton url={bookingUrl} className="nav-mobile-cta">
          Schedule a Free 15-Minute Call
        </ScheduleButton>
      </div>
    </>
  )
}
