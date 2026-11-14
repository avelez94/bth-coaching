import type { PageContent } from './site-content'
import type { ProgramKey, PublicProgramInfo } from './program-info'

// Props every editable page view receives (live page and admin preview)
export interface ViewProps {
  c: PageContent
  booking?: { free?: string; org?: string }
  programs?: Record<ProgramKey, PublicProgramInfo>
  contact?: { email: string; phone: string; location: string }
}
