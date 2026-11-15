import type { Metadata } from 'next'
import './globals.css'
import { DESCRIPTION, INDEXABLE, SHARE_IMAGE, SHORT_NAME, SITE_NAME, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SHORT_NAME}` },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  // Only the real production site is indexed; preview and test copies are not
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { type: 'website', siteName: SITE_NAME, locale: 'en_US', title: SITE_NAME, description: DESCRIPTION, images: [SHARE_IMAGE] },
  twitter: { card: 'summary_large_image', title: SITE_NAME, description: DESCRIPTION, images: [SHARE_IMAGE.url] },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300..600&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#F7F4ED' }}>
        {children}
      </body>
    </html>
  )
}