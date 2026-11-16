import type { MetadataRoute } from 'next'
import { INDEXABLE, PUBLIC_PAGES, absolute } from '@/lib/seo'
import { getPageVisibility } from '@/lib/site-data'
import { isOptionalPage } from '@/lib/optional-pages'

// Every public page, built from the same list the page titles come from,
// so a new page is added here automatically. Admin, enroll and checkout
// pages are not public and never listed. Preview copies list nothing.
// Optional pages are listed only while their Page Status is Active.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!INDEXABLE) return []
  const visible = await getPageVisibility()
  return Object.entries(PUBLIC_PAGES).filter(([key]) => !isOptionalPage(key) || visible[key]).map(([, p]) => ({
    url: absolute(p.path),
    changeFrequency: 'monthly',
    priority: p.path === '/' ? 1 : 0.8,
  }))
}
