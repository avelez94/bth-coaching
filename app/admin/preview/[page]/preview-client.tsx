'use client'

import { useEffect, useState, type ComponentType } from 'react'
import Nav from '@/app/components/nav'
import Footer from '@/app/components/footer'
import dynamic from 'next/dynamic'
import type { PageContent, PageKey } from '@/lib/site-content'
import type { SiteSettings } from '@/lib/site-settings'
import type { ViewProps } from '@/lib/view-props'
import type { PageVisibility } from '@/lib/optional-pages'
import { fillDeadline } from '@/lib/program-info'

// Each view is loaded on its own so only that page's stylesheet is present,
// matching the live page exactly (several pages share class names).
const VIEWS: Record<PageKey, ComponentType<ViewProps>> = {
  home: dynamic(() => import('@/app/(public)/home-view').then(m => {
    const Home = m.default
    return function HomeAdapter({ c, booking, engagements }: ViewProps) { return <Home c={c} bookingUrl={booking?.free} engagements={engagements} /> }
  })),
  'executive-coaching': dynamic(() => import('@/app/(public)/executive-coaching/view')),
  'leader-development': dynamic(() => import('@/app/(public)/leader-development/view')),
  sprint: dynamic(() => import('@/app/(public)/sprint/view')),
  faq: dynamic(() => import('@/app/(public)/faq/view')),
  'for-organizations': dynamic(() => import('@/app/(public)/for-organizations/view')),
  'sample-engagements': dynamic(() => import('@/app/(public)/sample-engagements/view')),
  'the-8-pillars': dynamic(() => import('@/app/(public)/the-8-pillars/view')),
  about: dynamic(() => import('@/app/(public)/about/view')),
  contact: dynamic(() => import('@/app/(public)/contact/view')),
}

export default function PreviewClient({ page, base, settings, visible, deadline }: { page: PageKey; base: ViewProps; settings: SiteSettings; visible: PageVisibility; deadline: string }) {
  const [content, setContent] = useState<PageContent>(base.c)

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== 'bth-preview' || e.data.page !== page) return
      // The draft keeps {deadline} placeholders; show the date as visitors will
      const draft = e.data.content as Record<string, string>
      setContent(Object.fromEntries(Object.entries(draft).map(([k, v]) => [k, typeof v === 'string' ? fillDeadline(v, deadline) : v])) as PageContent)
    }
    window.addEventListener('message', onMsg)
    window.parent?.postMessage({ type: 'bth-preview-ready' }, window.location.origin)
    // Links and buttons in the preview should not navigate away
    const block = (e: MouseEvent) => { if ((e.target as HTMLElement).closest('a, button')) e.preventDefault() }
    document.addEventListener('click', block, true)
    return () => { window.removeEventListener('message', onMsg); document.removeEventListener('click', block, true) }
  }, [page, deadline])

  const View = VIEWS[page]
  return (
    <>
      {/* The preview frame is taller than a laptop screen. Keep the Home top
          section at the height it has on a typical laptop (88% of ~820px). */}
      {page === 'home' && <style>{`.hero { min-height: min(88vh, 722px) !important; }`}</style>}
      <Nav bookingUrl={settings.bookingFreeCallUrl} visible={visible} />
      <main><View {...base} c={content} /></main>
      <Footer settings={settings} visible={visible} />
    </>
  )
}
