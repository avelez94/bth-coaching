import 'server-only'
import { connection } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import {
  DEFAULT_PRICING, PROGRAM_KEYS, buildProgramConfig,
  type ProgramConfig, type ProgramKey, type ProgramPricing,
} from './program-info'
import { DEFAULT_SETTINGS, SETTING_KEYS, type SiteSettings } from './site-settings'
import { PAGE_DEFAULTS, type PageKey } from './site-content'
import { AGREEMENT_HASH, AGREEMENT_TEXT, AGREEMENT_VERSION } from './agreement'

// ============================================================
// Server-only loaders for everything John edits in the admin.
// Every loader falls back to the built-in defaults (the copy and
// prices the site launched with) if the database is unreachable,
// so a database problem can never blank out a page.
// Public pages call these per request, so saved edits show
// immediately with no rebuild.
// ============================================================

let _db: SupabaseClient | null = null
export function db(): SupabaseClient {
  if (!_db) {
    _db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false },
    })
  }
  return _db
}

export async function getSettings(): Promise<SiteSettings> {
  await connection()
  try {
    const { data, error } = await db().from('site_settings').select('key, value')
    if (error || !data) return DEFAULT_SETTINGS
    const byKey = new Map(data.map(r => [r.key as string, r.value as string]))
    const out = { ...DEFAULT_SETTINGS }
    for (const field of Object.keys(SETTING_KEYS) as (keyof SiteSettings)[]) {
      const v = byKey.get(SETTING_KEYS[field])
      if (typeof v === 'string' && (v.trim() || field.startsWith('booking') || field.startsWith('linkedin'))) out[field] = v
    }
    return out
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function getPricing(): Promise<Record<ProgramKey, ProgramPricing>> {
  await connection()
  const out = { ...DEFAULT_PRICING }
  try {
    const { data, error } = await db().from('program_pricing').select('*')
    if (error || !data) return out
    for (const r of data) {
      if (!PROGRAM_KEYS.includes(r.program_key)) continue
      out[r.program_key as ProgramKey] = {
        fullPriceCents: r.full_price_cents,
        installmentAmountCents: r.installment_amount_cents,
        installmentCount: r.installment_count,
        stripeFullUrl: r.stripe_full_url,
        stripeInstallmentUrl: r.stripe_installment_url,
      }
    }
  } catch { /* fall back to defaults */ }
  return out
}

export async function getPrograms(): Promise<Record<ProgramKey, ProgramConfig>> {
  const pricing = await getPricing()
  return {
    'executive-coaching': buildProgramConfig('executive-coaching', pricing['executive-coaching']),
    '8-pillars': buildProgramConfig('8-pillars', pricing['8-pillars']),
  }
}

// Page text and image URLs, merged over the page's built-in defaults.
export async function getPageContent<P extends PageKey>(page: P): Promise<(typeof PAGE_DEFAULTS)[P]> {
  await connection()
  const defaults = PAGE_DEFAULTS[page]
  try {
    const { data, error } = await db().from('site_content').select('key, value').eq('page', page)
    if (error || !data) return defaults
    // Required fields are validated non-empty when saved; optional fields may be blank.
    const merged: Record<string, string> = { ...(defaults as Record<string, string>) }
    for (const r of data) {
      if (r.key in merged && typeof r.value === 'string') merged[r.key] = r.value
    }
    return merged as (typeof PAGE_DEFAULTS)[P]
  } catch {
    return defaults
  }
}

export interface ActiveAgreement {
  id: string | null
  version: string
  content: string
  hash: string
}

export async function getActiveAgreement(): Promise<ActiveAgreement> {
  await connection()
  try {
    const { data } = await db()
      .from('agreements')
      .select('id, version, content, content_hash')
      .eq('is_active', true)
      .maybeSingle()
    if (data) return { id: data.id, version: data.version, content: data.content, hash: data.content_hash }
  } catch { /* fall back */ }
  return { id: null, version: AGREEMENT_VERSION, content: AGREEMENT_TEXT, hash: AGREEMENT_HASH }
}

// Everything an editable page view needs: its content, booking links,
// display prices (no Stripe links), and contact details.
export async function getViewProps(page: PageKey): Promise<import('./view-props').ViewProps> {
  const [c, programs, settings] = await Promise.all([getPageContent(page), getPrograms(), getSettings()])
  const { toPublic } = await import('./program-info')
  return {
    c,
    programs: { 'executive-coaching': toPublic(programs['executive-coaching']), '8-pillars': toPublic(programs['8-pillars']) },
    booking: { free: settings.bookingFreeCallUrl, org: settings.bookingOrgConsultUrl },
    contact: { email: settings.contactEmail, phone: settings.phone, location: settings.location },
  }
}
