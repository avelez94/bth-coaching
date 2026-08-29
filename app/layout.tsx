import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Beyond the Horizon — Executive Coaching & Consulting',
  description: 'Executive coaching and consulting to help leaders navigate change, unlock potential, and create lasting impact.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}