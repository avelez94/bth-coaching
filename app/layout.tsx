import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Nav from './components/nav'
import Footer from './components/footer'

export const metadata: Metadata = {
  title: {
    default: 'Beyond the Horizon — Executive Coaching and Consulting',
    template: '%s | Beyond the Horizon',
  },
  description: 'Executive coaching and consulting for leaders who are ready to navigate change, unlock potential, and create lasting impact. Led by John McCracken, retired U.S. Navy Captain and ICF certified coach.',
  keywords: ['executive coaching','leadership coaching','business coaching','individual coaching','executive consulting','John McCracken','Beyond the Horizon','ICF certified coach','leadership development','executive leadership'],
  authors: [{ name: 'John McCracken' }],
  creator: 'Beyond the Horizon Executive Coaching and Consulting',
  metadataBase: new URL('https://mccrackencoaching.com'),
  openGraph: { type: 'website', locale: 'en_US', url: 'https://mccrackencoaching.com', siteName: 'Beyond the Horizon', title: 'Beyond the Horizon — Executive Coaching and Consulting', description: 'Strategic guidance for leaders who are ready to go beyond the horizon.', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Beyond the Horizon Executive Coaching' }] },
  twitter: { card: 'summary_large_image', title: 'Beyond the Horizon — Executive Coaching and Consulting', description: 'Strategic guidance for leaders who are ready to go beyond the horizon.', images: ['/og-image.png'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-invoke-path') || ''
  const isAdmin = pathname.startsWith('/admin')

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{margin:0,padding:0,background:'#F7F4ED'}}>
        {!isAdmin && <Nav />}
        <main>{children}</main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  )
}
