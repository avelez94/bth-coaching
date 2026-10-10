import './footer.css'

export default function Footer() {
  const links = [
    { label: 'Home', href: '/' },
    { label: 'Executive Coaching', href: '/executive-coaching' },
    { label: 'Leader Development', href: '/leader-development' },
    { label: 'For Organizations', href: '/for-organizations' },
    { label: 'Sample Engagements', href: '/sample-engagements' },
    { label: 'The 8 Pillars', href: '/the-8-pillars' },
    { label: 'About', href: '/about' },
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
              <p className="footer-desc">Whole-person coaching and leadership development.</p>
              <p className="footer-location">Washington, DC area | Virtual worldwide</p>
            </div>

            {/* Column 2: Navigation links */}
            <nav className="footer-links" aria-label="Footer navigation">
              {links.map((link) => (
                <a key={link.href} href={link.href}>{link.label}</a>
              ))}
            </nav>

            {/* Column 3: Contact */}
            <div className="footer-contact">
              <a href="mailto:john@mccrackencoaching.com">john@mccrackencoaching.com</a>
              <a href="tel:7037052225">703-705-2225</a>
              <a href="/contact">Schedule a Free 15-Minute Call →</a>
              {/* PLACEHOLDER: Replace with actual LinkedIn URLs when provided */}
              <span className="footer-linkedin-pending">LinkedIn: Beyond the Horizon (pending)</span>
              <span className="footer-linkedin-pending">LinkedIn: John McCracken (pending)</span>
            </div>

          </div>

          <div className="footer-bottom">
            <div className="footer-tagline">Together we get Beyond your Horizon.</div>
            <div className="footer-copy">© 2026 Beyond the Horizon Executive Coaching &amp; Consulting LLC. All rights reserved.</div>
          </div>
        </div>
      </footer>
  )
}
