'use client'

import { useEffect, useState, type ComponentType } from 'react'
import Nav from '@/app/components/nav'
import Footer from '@/app/components/footer'
import dynamic from 'next/dynamic'
import type { PageContent, PageKey } from '@/lib/site-content'
import type { SiteSettings } from '@/lib/site-settings'
import type { ViewProps } from '@/lib/view-props'

// Each view is loaded on its own so only that page's stylesheet is present,
// matching the live page exactly (several pages share class names).
const VIEWS: Record<PageKey, ComponentType<ViewProps>> = {
  home: dynamic(() => import('@/app/(public)/home-view').then(m => {
    const Home = m.default
    return function HomeAdapter({ c, booking }: ViewProps) { return <Home c={c} bookingUrl={booking?.free} /> }
  })),
  'executive-coaching': dynamic(() => import('@/app/(public)/executive-coaching/view')),
  'leader-development': dynamic(() => import('@/app/(public)/leader-development/view')),
  'for-organizations': dynamic(() => import('@/app/(public)/for-organizations/view')),
  'sample-engagements': dynamic(() => import('@/app/(public)/sample-engagements/view')),
  'the-8-pillars': dynamic(() => import('@/app/(public)/the-8-pillars/view')),
  about: dynamic(() => import('@/app/(public)/about/view')),
  contact: dynamic(() => import('@/app/(public)/contact/view')),
}

export default function PreviewClient({ page, base, settings }: { page: PageKey; base: ViewProps; settings: SiteSettings }) {
  const [content, setContent] = useState<PageContent>(base.c)

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== 'bth-preview' || e.data.page !== page) return
      setContent(e.data.content)
    }
    window.addEventListener('message', onMsg)
    window.parent?.postMessage({ type: 'bth-preview-ready' }, window.location.origin)
    // Links and buttons in the preview should not navigate away
    const block = (e: MouseEvent) => { if ((e.target as HTMLElement).closest('a, button')) e.preventDefault() }
    document.addEventListener('click', block, true)
    return () => { window.removeEventListener('message', onMsg); document.removeEventListener('click', block, true) }
  }, [page])

  const View = VIEWS[page]
  return (
    <>
      <Nav bookingUrl={settings.bookingFreeCallUrl} />
      <main><View {...base} c={content} /></main>
      <Footer settings={settings} />
    </>
  )
}
