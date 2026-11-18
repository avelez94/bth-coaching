import 'server-only'
import { connection } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import {
  DEFAULT_PRICING, DEFAULT_SPRINT_PRICING, PROGRAM_KEYS, buildProgramConfig,
  type ProgramConfig, type ProgramKey, type ProgramPricing, type SprintPricing,
} from './program-info'
import { DEFAULT_SETTINGS, SETTING_KEYS, type SiteSettings, mainBookingUrl } from './site-settings'
import { PAGE_DEFAULTS, type PageKey } from './site-content'
import { AGREEMENT_HASH, AGREEMENT_TEXT, AGREEMENT_VERSION } from './agreement'
import {
  DEFAULT_VISIBILITY, OPTIONAL_PAGES, OPTIONAL_PAGE_KEYS, statusSettingKey,
  type OptionalPageKey, type PageStatus, type PageVisibility,
} from './optional-pages'

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

// Page Status (Active / Hidden) for every optional page. Read on the
// server for each request, so a change in the admin applies at once.
export async function getPageStatuses(): Promise<Record<OptionalPageKey, PageStatus>> {
  await connection()
  const out = Object.fromEntries(OPTIONAL_PAGE_KEYS.map(k => [k, OPTIONAL_PAGES[k].defaultStatus])) as Record<OptionalPageKey, PageStatus>
  try {
    const { data, error } = await db().from('site_settings').select('key, value')
      .in('key', OPTIONAL_PAGE_KEYS.map(statusSettingKey))
    if (error || !data) return out
    for (const k of OPTIONAL_PAGE_KEYS) {
      const v = data.find(r => r.key === statusSettingKey(k))?.value
      if (v === 'active' || v === 'hidden') out[k] = v
    }
  } catch { /* fall back to defaults */ }
  return out
}

export async function getPageVisibility(): Promise<PageVisibility> {
  try {
    const st = await getPageStatuses()
    return Object.fromEntries(OPTIONAL_PAGE_KEYS.map(k => [k, st[k] === 'active'])) as PageVisibility
  } catch {
    return DEFAULT_VISIBILITY
  }
}

export async function isPageActive(key: OptionalPageKey): Promise<boolean> {
  return (await getPageStatuses())[key] === 'active'
}

export async function getSprintPricing(): Promise<SprintPricing> {
  await connection()
  try {
    const { data } = await db().from('program_pricing').select('*').eq('program_key', 'sprint').maybeSingle()
    if (data) return {
      priceCents: data.full_price_cents,
      stripeEnrollUrl: data.stripe_full_url,
      stripeGiftUrl: data.stripe_gift_url ?? DEFAULT_SPRINT_PRICING.stripeGiftUrl,
      giftRedeemBy: data.gift_redeem_by ? new Date(data.gift_redeem_by).toISOString() : DEFAULT_SPRINT_PRICING.giftRedeemBy,
    }
  } catch { /* fall back to defaults */ }
  return DEFAULT_SPRINT_PRICING
}

export async function getPrograms(): Promise<Record<ProgramKey, ProgramConfig>> {
  const pricing = await getPricing()
  return {
    'executive-coaching': buildProgramConfig('executive-coaching', pricing['executive-coaching']),
    '8-pillars': buildProgramConfig('8-pillars', pricing['8-pillars']),
  }
}

// Page text and image URLs, merged over the page's built-in defaults.
// Page text as visitors see it. In Sprint and FAQ text, {deadline} and
// {deadline_short} become the Sprint registration deadline from Pricing.
export async function getPageContent<P extends PageKey>(page: P): Promise<(typeof PAGE_DEFAULTS)[P]> {
  const raw = await getRawPageContent(page)
  if (page !== 'sprint' && page !== 'faq') return raw
  const { giftRedeemBy } = await getSprintPricing()
  const { fillDeadline } = await import('./program-info')
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(raw as Record<string, string>)) out[k] = typeof v === 'string' ? fillDeadline(v, giftRedeemBy) : v
  return out as (typeof PAGE_DEFAULTS)[P]
}

// Page text exactly as saved (Admin editor), placeholders kept
export async function getRawPageContent<P extends PageKey>(page: P): Promise<(typeof PAGE_DEFAULTS)[P]> {
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
  const [c, programs, settings, se, sprint, visible] = await Promise.all([
    getPageContent(page), getPrograms(), getSettings(),
    page === 'home' ? getPageContent('sample-engagements') : Promise.resolve(null),
    page === 'sprint' || page === 'faq' ? getSprintPricing() : Promise.resolve(null),
    getPageVisibility(),
  ])
  const { toPublic, sprintPublic } = await import('./program-info')
  return {
    c,
    ...(se ? { engagements: engagementPreviews(se) } : {}),
    ...(sprint ? { sprint: sprintPublic(sprint) } : {}),
    visible,
    programs: { 'executive-coaching': toPublic(programs['executive-coaching']), '8-pillars': toPublic(programs['8-pillars']) },
    booking: { main: mainBookingUrl(settings), free: settings.bookingFreeCallUrl, org: settings.bookingOrgConsultUrl },
    contact: { email: settings.contactEmail, phone: settings.phone, location: settings.location },
  }
}

// Program each Sample Engagement links to (matches the Sample Engagements page)
const ENGAGEMENT_LINKS: Record<string, string[]> = {
  coach: ['/for-organizations', '/executive-coaching', '/leader-development'],
  cmd: ['/leader-development', '/for-organizations', '/for-organizations', '/leader-development'],
}

function engagementPreviews(se: Record<string, string>): import('./view-props').EngagementPreview[] {
  return Object.entries(ENGAGEMENT_LINKS).flatMap(([g, links]) =>
    links.map((href, i) => ({
      group: (se[`${g}.label`] ?? '').replace(/\.$/, ''),
      title: se[`${g}.${i + 1}.title`] ?? '',
      result: se[`${g}.${i + 1}.result`] ?? '',
      context: se[`${g}.${i + 1}.context`] ?? '',
      link: se[`${g}.${i + 1}.link`] ?? '',
      href,
    })),
  ).filter(e => e.title && e.result)
}
