'use client'

import { useEffect, useState, type ComponentType } from 'react'
import Nav from '@/app/components/nav'
import Footer from '@/app/components/footer'
import HomeView from '@/app/(public)/home-view'
import ExecutiveCoachingView from '@/app/(public)/executive-coaching/view'
import LeaderDevelopmentView from '@/app/(public)/leader-development/view'
import ForOrganizationsView from '@/app/(public)/for-organizations/view'
import SampleEngagementsView from '@/app/(public)/sample-engagements/view'
import The8PillarsView from '@/app/(public)/the-8-pillars/view'
import AboutView from '@/app/(public)/about/view'
import ContactView from '@/app/(public)/contact/view'
import type { PageContent, PageKey } from '@/lib/site-content'
import type { SiteSettings } from '@/lib/site-settings'
import type { ViewProps } from '@/lib/view-props'

const HomeAdapter = ({ c, booking }: ViewProps) => <HomeView c={c} bookingUrl={booking?.free} />

const VIEWS: Record<PageKey, ComponentType<ViewProps>> = {
  home: HomeAdapter,
  'executive-coaching': ExecutiveCoachingView,
  'leader-development': LeaderDevelopmentView,
  'for-organizations': ForOrganizationsView,
  'sample-engagements': SampleEngagementsView,
  'the-8-pillars': The8PillarsView,
  about: AboutView,
  contact: ContactView,
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
