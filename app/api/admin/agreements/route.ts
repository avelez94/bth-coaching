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
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('agreements')
    .select('id, version, effective_date, title, content_hash, is_active, notes, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ agreements: data })
}

// POST /api/admin/agreements
// Add a new agreement version and optionally mark it active
// Body: { version, effective_date, content, notes?, make_active? }
export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { version, effective_date, content, notes, make_active } = body

  if (!version || !effective_date || !content) {
    return NextResponse.json({ error: 'version, effective_date, and content are required.' }, { status: 400 })
  }

  const content_hash = createHash('sha256').update(content).digest('hex')

  // If making active, deactivate all others first
  if (make_active) {
    await supabaseAdmin
      .from('agreements')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000') // update all rows
  }

  const { data, error } = await supabaseAdmin
    .from('agreements')
    .insert({
      version,
      effective_date,
      content,
      content_hash,
      is_active: make_active === true,
      notes: notes || null,
      title: 'Coaching Services Agreement',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ agreement: data })
}

// PATCH /api/admin/agreements
// Set a specific agreement version as active
// Body: { id }
export async function PATCH(req: NextRequest) {
  if (!verifyAdminToken(req)) {
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
