import type { MetadataRoute } from 'next'
import { INDEXABLE, PUBLIC_PAGES, absolute } from '@/lib/seo'

// Every public page, built from the same list the page titles come from,
// so a new page is added here automatically. Admin, enroll and checkout
// pages are not public and never listed. Preview copies list nothing.
export default function sitemap(): MetadataRoute.Sitemap {
  if (!INDEXABLE) return []
  return Object.values(PUBLIC_PAGES).map(p => ({
    url: absolute(p.path),
    changeFrequency: 'monthly',
    priority: p.path === '/' ? 1 : 0.8,
  }))
}
