import './footer.css'
import ScheduleButton from './schedule-button'
import { telHref, type SiteSettings } from '@/lib/site-settings'
import { DEFAULT_VISIBILITY, OPTIONAL_PAGES, type PageVisibility } from '@/lib/optional-pages'

const IconMail = () => (
  <svg className="footer-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.5" y="3.5" width="13" height="9" rx="1" stroke="currentColor" strokeWidth="1.25"/>
    <path d="M1.5 5l6.5 4.5L14.5 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
  </svg>
)

const IconPhone = () => (
  <svg className="footer-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 2.5h3l1 3-1.5 1a9 9 0 004 4l1-1.5 3 1V13a1 1 0 01-1 1C5.5 14 2 8.5 2 3.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
  </svg>
)

const IconLinkedIn = () => (
  <svg className="footer-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.25"/>
    <path d="M4.5 6.5v5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
    <circle cx="4.5" cy="4.5" r="0.75" fill="currentColor"/>
    <path d="M7.5 11.5V9a1.5 1.5 0 013 0v2.5M7.5 8v3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconInstagram = () => (
  <svg className="footer-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.5" y="1.5" width="13" height="13" rx="3" stroke="currentColor" strokeWidth="1.25"/>
    <circle cx="8" cy="8" r="2.75" stroke="currentColor" strokeWidth="1.25"/>
    <circle cx="11.5" cy="4.5" r="0.75" fill="currentColor"/>
  </svg>
)

export default function Footer({ settings, visible = DEFAULT_VISIBILITY }: { settings: SiteSettings; visible?: PageVisibility }) {
  // Optional pages (Page Status in the admin) appear only while Active
  const opt = (k: keyof PageVisibility) => (visible[k] ? [{ label: OPTIONAL_PAGES[k].label, href: OPTIONAL_PAGES[k].path }] : [])
  const links = [
    { label: 'Home', href: '/' },
    { label: 'Executive Coaching', href: '/executive-coaching' },
    { label: 'Leader Development', href: '/leader-development' },
    ...opt('sprint'),
    { label: 'For Organizations', href: '/for-organizations' },
    { label: 'Sample Engagements', href: '/sample-engagements' },
    { label: 'The 8 Pillars', href: '/the-8-pillars' },
    { label: 'About', href: '/about' },
    ...opt('faq'),
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">

            {/* Column 1: Brand */}
            <div className="footer-brand">
              <a href="/">
                <img src="/images/bth-logo-footer.png" alt="Beyond the Horizon" />
              </a>
              <p className="footer-desc">{settings.footerDescription}</p>
              <p className="footer-location">{settings.location}</p>
            </div>

            {/* Column 2: Navigation links */}
            <nav className="footer-links" aria-label="Footer navigation">
              {links.map((link) => (
                <a key={link.href} href={link.href}>{link.label}</a>
              ))}
            </nav>

            {/* Column 3: Contact */}
            <div className="footer-contact">
              <a href={`mailto:${settings.contactEmail}`} className="footer-contact-link">
                <IconMail />
                {settings.contactEmail}
              </a>
              <a href={telHref(settings.phone)} className="footer-contact-link">
                <IconPhone />
                {settings.phone}
              </a>
              <ScheduleButton url={settings.bookingFreeCallUrl} className="footer-schedule-placeholder">
                Schedule a Free 15-Minute Call →
              </ScheduleButton>
              {settings.linkedinCompanyUrl && (
                <a href={settings.linkedinCompanyUrl} target="_blank" rel="noopener noreferrer" className="footer-contact-link">
                  <IconLinkedIn />
                  LinkedIn: Beyond the Horizon
                </a>
              )}
              {settings.linkedinPersonalUrl && (
                <a href={settings.linkedinPersonalUrl} target="_blank" rel="noopener noreferrer" className="footer-contact-link">
                  <IconLinkedIn />
                  LinkedIn: John McCracken
                </a>
              )}
              {/* PENDING INSTAGRAM URL: add when available */}
            </div>

          </div>

          <div className="footer-bottom">
            <div className="footer-tagline">{settings.footerTagline}</div>
            <div className="footer-copy">© {new Date().getFullYear()} {settings.businessName}. All rights reserved.</div>
            <p className="footer-disclaimer">References to John McCracken&apos;s service with the U.S. Navy and Department of Defense describe professional background only and do not imply endorsement by the Department of the Navy, the Department of Defense, or the U.S. Government.</p>
            <p className="footer-disclaimer">Coaching is not psychotherapy, counseling, or medical, legal, or financial advice. Client examples are illustrative and anonymized; individual results vary, and past outcomes do not guarantee similar results.</p>
            <div className="footer-credit">Made with <span className="footer-credit-heart">♥</span> by <a href="https://alantevelez.com" target="_blank" rel="noopener noreferrer">Alante Velez</a></div>
          </div>
        </div>
      </footer>
  )
}
