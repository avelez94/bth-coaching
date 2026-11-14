import PreviewClient from './preview-client'
import { PAGE_KEYS, type PageKey } from '@/lib/site-content'
import { getSettings, getViewProps } from '@/lib/site-data'
import { notFound } from 'next/navigation'

// Admin preview: renders the real page layout with current prices, links,
// and contact details. The editor sends the draft text and photos over.
export default async function PreviewPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  if (!PAGE_KEYS.includes(page as PageKey)) notFound()
  const [props, settings] = await Promise.all([getViewProps(page as PageKey), getSettings()])
  return <PreviewClient page={page as PageKey} base={props} settings={settings} />
}
