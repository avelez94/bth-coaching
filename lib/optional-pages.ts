// ============================================================
// Optional pages: pages John can switch between Active and Hidden
// in the admin (Page Status). Safe to import in the browser.
//
// To give another page a Page Status later, add one entry here.
// Everything else (navigation, footer, sitemap, redirects, the
// admin control) reads from this list.
// ============================================================

export type PageStatus = 'active' | 'hidden'
export type OptionalPageKey = 'sprint'

export interface OptionalPage {
  label: string
  path: string
  /** Where visitors are sent while the page is hidden */
  hiddenRedirect: string
  /** Plain-language name of that destination, shown in the admin */
  hiddenRedirectLabel: string
  /** Status used until John first changes it */
  defaultStatus: PageStatus
}

export const OPTIONAL_PAGES: Record<OptionalPageKey, OptionalPage> = {
  sprint: {
    label: '8 Pillar Sprint',
    path: '/sprint',
    hiddenRedirect: '/leader-development',
    hiddenRedirectLabel: 'the 8 Pillars Leadership page',
    // Hidden until John confirms the session time and switches it on
    defaultStatus: 'hidden',
  },
}

export const OPTIONAL_PAGE_KEYS = Object.keys(OPTIONAL_PAGES) as OptionalPageKey[]

export function isOptionalPage(key: string): key is OptionalPageKey {
  return key in OPTIONAL_PAGES
}

/** site_settings key holding a page's status */
export const statusSettingKey = (key: OptionalPageKey) => `page_status.${key}`

/** Which optional pages are live right now */
export type PageVisibility = Record<OptionalPageKey, boolean>

export const DEFAULT_VISIBILITY: PageVisibility = Object.fromEntries(
  OPTIONAL_PAGE_KEYS.map(k => [k, OPTIONAL_PAGES[k].defaultStatus === 'active']),
) as PageVisibility
