import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { db, getPageStatuses } from '@/lib/site-data'
import { isOptionalPage, statusSettingKey } from '@/lib/optional-pages'

// GET /api/admin/page-status: Active or Hidden for every optional page
export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ statuses: await getPageStatuses() })
}

// PUT /api/admin/page-status  Body: { page, status: 'active' | 'hidden' }
// Only the status changes. Page content, images, pricing and links stay as saved.
export async function PUT(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => null)
  const page = String(body?.page ?? '')
  const status = body?.status
  if (!isOptionalPage(page) || (status !== 'active' && status !== 'hidden')) {
    return NextResponse.json({ error: 'Nothing to save.' }, { status: 400 })
  }
  const { error } = await db().from('site_settings').upsert(
    { key: statusSettingKey(page), value: status, updated_at: new Date().toISOString() },
    { onConflict: 'key' },
  )
  if (error) return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 })
  return NextResponse.json({ statuses: await getPageStatuses() })
}
