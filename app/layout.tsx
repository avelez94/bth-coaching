import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Beyond the Horizon — Executive Coaching and Consulting',
    template: '%s | Beyond the Horizon',
  },
  description: 'Executive coaching and consulting for leaders who are ready to navigate change, unlock potential, and create lasting impact. Led by John McCracken, retired U.S. Navy Captain and ICF certified coach.',
  metadataBase: new URL('https://mccrackencoaching.com'),
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{margin:0,padding:0,background:'#F7F4ED'}}>
        {children}
      </body>
    </html>
  )
}
