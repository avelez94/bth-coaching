import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { db, getSettings } from '@/lib/site-data'
import { SETTING_KEYS, validateSetting, type SiteSettings } from '@/lib/site-settings'

// GET /api/admin/settings: current Site Settings and booking links
export async function GET(req: NextRequest) {
  if (!(await verifyAdminToken(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ settings: await getSettings() })
}

// PUT /api/admin/settings  Body: { settings: Partial<SiteSettings> }
// Validates every field, then saves. Nothing is saved if any field is invalid.
export async function PUT(req: NextRequest) {
  if (!(await verifyAdminToken(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  const incoming = body?.settings
  if (!incoming || typeof incoming !== 'object') return NextResponse.json({ error: 'Nothing to save.' }, { status: 400 })

  const errors: Record<string, string> = {}
  const rows: { key: string; value: string; updated_at: string }[] = []
  const now = new Date().toISOString()
  for (const field of Object.keys(incoming) as (keyof SiteSettings)[]) {
    if (!(field in SETTING_KEYS) || typeof incoming[field] !== 'string') continue
    const check = validateSetting(field, incoming[field])
    if (!check.ok) { errors[field] = check.error; continue }
    rows.push({ key: SETTING_KEYS[field], value: check.value, updated_at: now })
  }
  if (Object.keys(errors).length) return NextResponse.json({ error: 'Some fields need attention.', fieldErrors: errors }, { status: 400 })
  if (!rows.length) return NextResponse.json({ error: 'Nothing to save.' }, { status: 400 })

  const { error } = await db().from('site_settings').upsert(rows, { onConflict: 'key' })
  if (error) return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 })
  return NextResponse.json({ settings: await getSettings() })
}
