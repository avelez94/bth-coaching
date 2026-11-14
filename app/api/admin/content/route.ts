import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { db, getPageContent } from '@/lib/site-data'
import { PAGE_KEYS, fieldDef, maxLength, type PageKey } from '@/lib/site-content'

const SUPABASE_IMAGES = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

// GET /api/admin/content?page=home: saved content for one page (defaults filled in)
export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const page = req.nextUrl.searchParams.get('page') as PageKey
  if (!PAGE_KEYS.includes(page)) return NextResponse.json({ error: 'Unknown page.' }, { status: 400 })
  return NextResponse.json({ content: await getPageContent(page) })
}

// PUT /api/admin/content  Body: { page, values: { [fieldKey]: string } }
// Only fields defined for that page are accepted. Required text cannot be
// blank, length is capped so layouts hold, and images must be site images.
export async function PUT(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  const page = body?.page as PageKey
  const values = body?.values as Record<string, unknown>
  if (!PAGE_KEYS.includes(page) || !values || typeof values !== 'object') return NextResponse.json({ error: 'Nothing to save.' }, { status: 400 })

  const fieldErrors: Record<string, string> = {}
  const rows: { page: string; key: string; value: string; updated_at: string }[] = []
  const now = new Date().toISOString()
  for (const [key, raw] of Object.entries(values)) {
    const f = fieldDef(page, key)
    if (!f || typeof raw !== 'string') continue
    const value = f.type === 'image' ? raw.trim() : raw.replace(/\r\n/g, '\n').trim()
    if (!value && !f.optional) { fieldErrors[key] = `${f.label} cannot be empty.`; continue }
    if (value.length > maxLength(f)) { fieldErrors[key] = `${f.label} is too long (${value.length} of ${maxLength(f)} characters).`; continue }
    if (f.type === 'image' && !(value.startsWith('/images/') || value.startsWith(SUPABASE_IMAGES))) {
      fieldErrors[key] = `${f.label} must be an uploaded site image.`; continue
    }
    rows.push({ page, key, value, updated_at: now })
  }
  if (Object.keys(fieldErrors).length) return NextResponse.json({ error: 'Some fields need attention.', fieldErrors }, { status: 400 })
  if (!rows.length) return NextResponse.json({ error: 'Nothing to save.' }, { status: 400 })

  const { error } = await db().from('site_content').upsert(rows, { onConflict: 'page,key' })
  if (error) return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 })
  return NextResponse.json({ content: await getPageContent(page) })
}
