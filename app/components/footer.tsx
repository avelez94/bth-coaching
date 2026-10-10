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
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .footer {
          background: #0D1B2A;
          padding: 80px 72px 48px;
          border-top: 1px solid rgba(201,162,58,0.12);
        }
        .footer-inner {
          max-width: 1320px;
          margin: 0 auto;
        }
        .footer-top {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1.2fr;
          gap: 80px;
          margin-bottom: 64px;
        }

        /* Column 1 */
        .footer-brand a {
          display: inline-block;
          margin-bottom: 20px;
        }
        .footer-brand img {
          height: 90px;
          width: auto;
          display: block;
        }
        .footer-desc {
          font-size: 0.82rem;
          line-height: 1.75;
          color: rgba(247,244,237,0.35);
          max-width: 280px;
          margin-bottom: 10px;
        }
        .footer-location {
          font-size: 0.78rem;
          color: rgba(247,244,237,0.25);
          line-height: 1.6;
        }

        /* Column 2 */
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .footer-links a {
          font-size: 0.82rem;
          color: rgba(247,244,237,0.45);
          text-decoration: none;
          padding: 7px 0;
          transition: color 0.2s;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .footer-links a:first-child {
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .footer-links a:hover {
          color: #fff;
        }

        /* Column 3 */
        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .footer-contact a {
          font-size: 0.82rem;
          color: rgba(247,244,237,0.45);
          text-decoration: none;
          padding: 7px 0;
          transition: color 0.2s;
          display: block;
        }
        .footer-contact a:hover {
          color: #fff;
        }
        .footer-contact-schedule {
          display: inline-block;
          font-size: 0.82rem;
          color: rgba(247,244,237,0.45);
          padding: 7px 0;
        }
        /* PLACEHOLDER: LinkedIn URLs pending — rendered as non-clickable labels for now */
        .footer-linkedin-pending {
          font-size: 0.82rem;
          color: rgba(247,244,237,0.22);
          padding: 7px 0;
          display: block;
          cursor: default;
        }

        /* Bottom */
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 32px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-tagline {
          font-family: 'DM Serif Display', serif;
          font-size: 1rem;
          color: rgba(247,244,237,0.45);
          font-style: italic;
          letter-spacing: -0.01em;
        }
        .footer-copy {
          font-size: 0.72rem;
          color: rgba(247,244,237,0.2);
        }

        @media (max-width: 1024px) {
          .footer { padding: 60px 40px 40px; }
          .footer-top { grid-template-columns: 1fr 1fr; gap: 48px; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 640px) {
          .footer { padding: 60px 24px 40px; }
          .footer-top { grid-template-columns: 1fr; gap: 40px; }
        }
      ` }} />
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
    </>
  )
}
