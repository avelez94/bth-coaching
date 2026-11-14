import PreviewClient from './preview-client'
import { PAGE_KEYS, type PageKey } from '@/lib/site-content'
import { notFound } from 'next/navigation'

// Admin preview: renders the real page layout with the draft content the
// editor sends over. It shows the launch copy until the editor connects.
export default async function PreviewPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  if (!PAGE_KEYS.includes(page as PageKey)) notFound()
  return <PreviewClient page={page as PageKey} />
}
