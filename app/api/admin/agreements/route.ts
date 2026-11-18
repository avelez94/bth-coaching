import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'
import { verifyAdminToken } from '@/lib/admin-auth'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/admin/agreements
// Returns all agreement versions, most recent first
export async function GET(req: NextRequest) {
  if (!(await verifyAdminToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('agreements')
    .select('id, version, effective_date, title, content, content_hash, is_active, notes, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ agreements: data })
}

// POST /api/admin/agreements
// Saves a NEW agreement version. It is not used for enrollments until it is
// activated (PATCH), so there is never a moment with no active agreement.
// Existing versions and signed agreements are never modified.
// Body: { version, effective_date, content, notes? }
export async function POST(req: NextRequest) {
  if (!(await verifyAdminToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const version = String(body.version || '').trim()
  const effective_date = String(body.effective_date || '').trim()
  const content = String(body.content || '').replace(/\r\n/g, '\n')
  const notes = String(body.notes || '').trim()

  if (!version || !effective_date || !content.trim()) {
    return NextResponse.json({ error: 'A version label, an effective date, and the agreement text are all required.' }, { status: 400 })
  }
  if (version.length > 20) {
    return NextResponse.json({ error: 'Keep the version label short, for example 1.1 or 2.0.' }, { status: 400 })
  }

  const content_hash = createHash('sha256').update(content).digest('hex')

  const { data: existing } = await supabaseAdmin.from('agreements').select('version, content_hash')
  if (existing?.some(a => a.version === version)) {
    return NextResponse.json({ error: `Version ${version} already exists. Choose a new version label.` }, { status: 400 })
  }
  const same = existing?.find(a => a.content_hash === content_hash)
  if (same) {
    return NextResponse.json({ error: `This text is identical to version ${same.version}. Make your changes before saving a new version.` }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('agreements')
    .insert({
      version,
      effective_date,
      content,
      content_hash,
      is_active: false,
      notes: notes || null,
      title: 'Coaching Services Agreement',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Could not save the new version. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ agreement: data })
}

// PATCH /api/admin/agreements
// Set a specific agreement version as active
// Body: { id }
export async function PATCH(req: NextRequest) {
  if (!(await verifyAdminToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { id } = body

  if (!id) {
    return NextResponse.json({ error: 'id is required.' }, { status: 400 })
  }

  // Deactivate all, then activate the target
  await supabaseAdmin.from('agreements').update({ is_active: false }).neq('id', id)
  const { error } = await supabaseAdmin.from('agreements').update({ is_active: true }).eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
