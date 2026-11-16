import type { MetadataRoute } from 'next'
import { INDEXABLE, SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  // Preview and test copies ask every search engine to stay away
  if (!INDEXABLE) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/enroll', '/sprint/redeem'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
