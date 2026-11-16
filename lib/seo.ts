import type { Metadata } from 'next'

// ============================================================
// Search engine and link preview settings for the whole site.
// One place for the business name, address, tagline and the
// per-page titles and descriptions. No dashes in any of this text:
// it is shown in search results and link previews.
// ============================================================

export const SITE_NAME = 'Beyond the Horizon Executive Coaching & Consulting'
export const SHORT_NAME = 'Beyond the Horizon'

// The public address. Set NEXT_PUBLIC_SITE_URL in Vercel to change it
// (for example once the domain is connected). No trailing slash.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mccrackencoaching.com').replace(/\/+$/, '')

// Word for word everywhere the site describes itself. The Home page
// supporting statement defaults to this, and a test keeps them identical.
export const TAGLINE = 'I help leaders gain clarity and get results, without sacrificing everything else.'

export const DESCRIPTION =
  'Executive coaching and consulting for leaders who are ready to navigate change, unlock potential, and create lasting impact. Led by John McCracken, retired U.S. Navy Captain and ICF certified coach.'

// Home meta description: the tagline, then who leads the work
export function homeDescription(tagline: string = TAGLINE): string {
  return `${tagline} Executive coaching and consulting led by John McCracken, retired U.S. Navy Captain and ICF certified coach.`
}

export const SHARE_IMAGE = { url: '/images/share/bth-share.jpg', width: 1200, height: 630, alt: SITE_NAME }

// Only the real production site may be indexed. Vercel preview copies,
// local development and any other copy ask search engines to stay away.
export const INDEXABLE = process.env.VERCEL_ENV === 'production'

// Public pages, in sitemap order. Paths, titles and descriptions use only
// wording already on each page.
export const PUBLIC_PAGES = {
  'home': { path: '/', title: SITE_NAME, description: homeDescription() },
  'executive-coaching': {
    path: '/executive-coaching',
    title: 'Executive Coaching',
    description: "When the challenges are outpacing the solutions. You're not getting the results you want from yourself or your team, and working harder isn't closing the gap.",
  },
  'leader-development': {
    path: '/leader-development',
    title: '8 Pillars Leadership Program',
    description: 'A ten month development and coaching program for new leaders, stretched leaders, and anyone ready to become the leader they want to be, and the one their team needs.',
  },
  'sprint': {
    path: '/sprint',
    title: '8 Pillar Sprint',
    description: 'Eight weeks. Eight pillars. One framework built on what you value most. A small-group program for leaders, and anyone ready to strengthen their foundation, to start the year with clarity.',
  },
  'for-organizations': {
    path: '/for-organizations',
    title: 'For Organizations',
    description: "You need your leaders to lead. When someone isn't there yet, you can replace them or invest in them. I help you invest well.",
  },
  'sample-engagements': {
    path: '/sample-engagements',
    title: 'Sample Engagements',
    description: "Leadership in practice. Every leader's situation is different. These examples show what changes when leaders get the right support. Client details are anonymized.",
  },
  'the-8-pillars': {
    path: '/the-8-pillars',
    title: 'The 8 Pillars',
    description: 'The 8 Pillars is a whole person framework grounded in peer reviewed research on performance, resilience, and wellbeing and informed by neuroscience.',
  },
  'about': {
    path: '/about',
    title: 'About John McCracken',
    description: 'I help leaders gain clarity and get results, in every part of their lives. Thirty seven years of leadership, the setbacks as well as the successes, and professional coach training, all focused on the results you want.',
  },
  'faq': {
    path: '/faq',
    title: 'Frequently Asked Questions',
    description: 'Coaching is a partnership where you set the agenda and I help you think it through. Answers about the programs, confidentiality, sessions, and payment.',
  },
  'contact': {
    path: '/contact',
    title: 'Contact',
    description: "A better path starts with a single conversation. A free 15 minute call. No pitch, no pressure. Just a direct conversation about where you are, where you want to go, and whether we're the right fit to get you there.",
  },
} as const

export type PublicPageKey = keyof typeof PUBLIC_PAGES

export function pageMetadata(key: PublicPageKey, overrides?: { description?: string }): Metadata {
  const p = PUBLIC_PAGES[key]
  const description = overrides?.description ?? p.description
  const isHome = key === 'home'
  const title = isHome ? SITE_NAME : `${p.title} | ${SHORT_NAME}`
  return {
    title: isHome ? { absolute: SITE_NAME } : p.title,
    description,
    alternates: { canonical: p.path },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_US',
      url: p.path,
      title,
      description,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [SHARE_IMAGE.url],
    },
  }
}

// JSON for a <script type="application/ld+json"> tag. Escapes every
// character that could end the script tag or confuse an HTML parser,
// so no saved text can ever break out of the page head.
export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export const absolute = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`)
