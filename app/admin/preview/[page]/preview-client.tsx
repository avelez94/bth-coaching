'use client'

import { useEffect, useState, type ComponentType } from 'react'
import Nav from '@/app/components/nav'
import Footer from '@/app/components/footer'
import HomeView from '@/app/(public)/home-view'
import { PAGE_DEFAULTS, type PageContent, type PageKey } from '@/lib/site-content'
import { DEFAULT_SETTINGS } from '@/lib/site-settings'

const VIEWS: Record<PageKey, ComponentType<{ c: PageContent }>> = {
  home: HomeView,
}

export default function PreviewClient({ page }: { page: PageKey }) {
  const [content, setContent] = useState<PageContent>(PAGE_DEFAULTS[page])

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== 'bth-preview' || e.data.page !== page) return
      setContent(e.data.content)
    }
    window.addEventListener('message', onMsg)
    window.parent?.postMessage({ type: 'bth-preview-ready' }, window.location.origin)
    // Links in the preview should not navigate away
    const block = (e: MouseEvent) => { if ((e.target as HTMLElement).closest('a')) e.preventDefault() }
    document.addEventListener('click', block, true)
    return () => { window.removeEventListener('message', onMsg); document.removeEventListener('click', block, true) }
  }, [page])

  const View = VIEWS[page]
  return (
    <>
      <Nav />
      <main><View c={content} /></main>
      <Footer settings={DEFAULT_SETTINGS} />
    </>
  )
}
