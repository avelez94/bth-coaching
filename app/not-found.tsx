import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from './components/nav'
import Footer from './components/footer'
import { getPageVisibility, getSettings } from '@/lib/site-data'
import './not-found.css'
import { mainBookingUrl } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

// Shown with a real 404 status for any address that does not exist
export default async function NotFound() {
  const [settings, visible] = await Promise.all([getSettings(), getPageVisibility()])
  return (
    <>
      <Nav bookingUrl={mainBookingUrl(settings)} visible={visible} quote={{ text: settings.navQuote, by: settings.navQuoteAttribution }} />
      <main className="nf">
        <div className="nf-inner">
          <p className="nf-label">Page not found</p>
          <h1 className="nf-title">This page isn&apos;t here.</h1>
          <p className="nf-body">The address may be mistyped, or the page may have moved.</p>
          <div className="nf-links">
            <Link href="/" className="nf-primary">Go to the home page</Link>
            <a href="/contact" className="nf-secondary">Contact John →</a>
          </div>
        </div>
      </main>
      <Footer settings={settings} visible={visible} />
    </>
  )
}
