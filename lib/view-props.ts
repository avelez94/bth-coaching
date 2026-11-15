import type { PageContent } from './site-content'
import type { ProgramKey, PublicProgramInfo } from './program-info'

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
}
