import type { PageContent } from './site-content'
import type { ProgramKey, PublicProgramInfo, PublicSprintInfo } from './program-info'
import type { PageVisibility } from './optional-pages'

// A short preview of one Sample Engagement, shown on Home
export interface EngagementPreview {
  group: string
  title: string
  result: string
  context: string
  link: string
  href: string
}

// Props every editable page view receives (live page and admin preview)
export interface ViewProps {
  c: PageContent
  booking?: { free?: string; org?: string }
  programs?: Record<ProgramKey, PublicProgramInfo>
  contact?: { email: string; phone: string; location: string }
  /** Home only: the Sample Engagements examples, as saved on that page */
  engagements?: EngagementPreview[]
  /** Sprint and FAQ: the Sprint price and its two Stripe checkout links */
  sprint?: PublicSprintInfo
  /** Which optional pages are Active, for links to them inside a page */
  visible?: PageVisibility
}
