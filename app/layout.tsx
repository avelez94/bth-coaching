import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Beyond the Horizon — Executive Coaching and Consulting',
    template: '%s | Beyond the Horizon',
  },
  description: 'Executive coaching and consulting for leaders who are ready to navigate change, unlock potential, and create lasting impact. Led by John McCracken, retired U.S. Navy Captain and ICF certified coach.',
  metadataBase: new URL('https://mccrackencoaching.com'),
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Beyond the Horizon — Executive Coaching and Consulting',
    description: 'Executive coaching and consulting for leaders who are ready to navigate change, unlock potential, and create lasting impact.',
    url: 'https://mccrackencoaching.com',
    images: [
      {
        url: '/images/bth-og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#F7F4ED' }}>
        {children}
      </body>
    </html>
  )
}