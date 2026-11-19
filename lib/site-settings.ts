// ============================================================
// Site Settings: contact details and booking links John can edit
// in Admin > Site Settings and Admin > Scheduling.
// Defaults match what the live site showed before these became
// editable, so an empty database never changes the site.
// Safe to import in client components (no secrets).
// ============================================================

export interface SiteSettings {
  businessName: string
  footerDescription: string
  location: string
  contactEmail: string
  phone: string
  linkedinCompanyUrl: string
  linkedinPersonalUrl: string
  footerTagline: string
  bookingMainUrl: string
  bookingFreeCallUrl: string
  bookingOrgConsultUrl: string
  navQuote: string
  navQuoteAttribution: string
}

export const DEFAULT_SETTINGS: SiteSettings = {
  businessName: 'Beyond the Horizon Executive Coaching & Consulting LLC',
  footerDescription: 'Whole-person coaching and leadership development.',
  location: 'Washington, DC area | Virtual worldwide',
  contactEmail: 'john@mccrackencoaching.com',
  phone: '703-705-2225',
  linkedinCompanyUrl: 'https://www.linkedin.com/company/beyond-the-horizon-executive-coaching-and-consulting/',
  linkedinPersonalUrl: 'https://www.linkedin.com/in/johnmccracken3/',
  footerTagline: 'Together, we get beyond your horizon.',
  bookingMainUrl: '',
  bookingFreeCallUrl: '',
  bookingOrgConsultUrl: '',
  navQuote: 'The winds and the waves are always on the side of the ablest navigator',
  navQuoteAttribution: 'Edward Gibbon',
}

// Database keys (site_settings.key) for each setting
export const SETTING_KEYS: Record<keyof SiteSettings, string> = {
  businessName: 'business_name',
  footerDescription: 'footer_description',
  location: 'location',
  contactEmail: 'contact_email',
  phone: 'phone_display',
  linkedinCompanyUrl: 'linkedin_company_url',
  linkedinPersonalUrl: 'linkedin_personal_url',
  footerTagline: 'footer_tagline',
  bookingMainUrl: 'booking_main_url',
  bookingFreeCallUrl: 'booking_free_call_url',
  bookingOrgConsultUrl: 'booking_org_consult_url',
  navQuote: 'nav_quote',
  navQuoteAttribution: 'nav_quote_attribution',
}

export function telHref(phone: string): string {
  return 'tel:' + phone.replace(/[^\d+]/g, '')
}

export type SettingCheck = { ok: true; value: string } | { ok: false; error: string }

// Validation shared by the admin form and the save route
export function validateSetting(key: keyof SiteSettings, raw: string): SettingCheck {
  const value = raw.trim()
  const isUrl = (v: string) => { try { const u = new URL(v); return u.protocol === 'https:' } catch { return false } }
  switch (key) {
    case 'contactEmail':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? { ok: true, value } : { ok: false, error: 'Enter a valid email address.' }
    case 'phone':
      return value.replace(/\D/g, '').length >= 10 ? { ok: true, value } : { ok: false, error: 'Enter a phone number with area code.' }
    case 'linkedinCompanyUrl':
    case 'linkedinPersonalUrl':
      if (!value) return { ok: true, value }
      return isUrl(value) && /linkedin\.com/i.test(value) ? { ok: true, value } : { ok: false, error: 'Paste the full LinkedIn address, starting with https://' }
    case 'bookingMainUrl':
    case 'bookingFreeCallUrl':
    case 'bookingOrgConsultUrl':
      if (!value) return { ok: true, value }
      return isUrl(value) ? { ok: true, value } : { ok: false, error: 'Paste the full booking page address, starting with https://' }
    case 'navQuote':
    case 'navQuoteAttribution': {
      // Blank hides the quote strip. Typed quote marks are added by the site.
      const v = value.replace(/^["\u201C\u201D]+|["\u201C\u201D]+$/g, '').trim()
      const max = key === 'navQuote' ? 160 : 60
      return v.length <= max ? { ok: true, value: v } : { ok: false, error: `Keep this under ${max} characters so it fits on one line.` }
    }
    default:
      return value ? { ok: true, value } : { ok: false, error: 'This field cannot be empty.' }
  }
}

// The link for general "Schedule" buttons (navigation, footer, Home, About):
// the Main Booking Page, where visitors choose Individual or Organizational.
// Falls back to the Individual Consultation link if it is ever left blank.
export function mainBookingUrl(s: Pick<SiteSettings, 'bookingMainUrl' | 'bookingFreeCallUrl'>): string {
  return s.bookingMainUrl?.trim() || s.bookingFreeCallUrl
}
