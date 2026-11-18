import PreviewClient from './preview-client'
import { PAGE_KEYS, type PageKey } from '@/lib/site-content'
import { getPageVisibility, getSettings, getSprintPricing, getViewProps } from '@/lib/site-data'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { COOKIE_NAME, sessionUser } from '@/lib/admin-auth'

// Admin preview: renders the real page layout with current prices, links,
// and contact details. The editor sends the draft text and photos over.
// Signed-in admins only: it shows pages that may be Hidden from visitors.
export default async function PreviewPage({ params }: { params: Promise<{ page: string }> }) {
  if (!(await sessionUser((await cookies()).get(COOKIE_NAME)?.value))) notFound()
  const { page } = await params
  if (!PAGE_KEYS.includes(page as PageKey)) notFound()
  const [props, settings, visible, sprint] = await Promise.all([getViewProps(page as PageKey), getSettings(), getPageVisibility(), getSprintPricing()])
  return <PreviewClient page={page as PageKey} base={props} settings={settings} visible={visible} deadline={sprint.giftRedeemBy} />
}
