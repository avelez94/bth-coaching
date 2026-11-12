import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { AGREEMENT_TEXT, AGREEMENT_VERSION, AGREEMENT_HASH } from '@/lib/agreement'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/admin/agreements/seed
// Idempotent: seeds the initial v1.0 agreement from lib/agreement.ts
// if no active agreement exists yet.
export async function POST(req: NextRequest) {
  // Basic auth: must include ENROLLMENT_ENABLED-equivalent header or be called internally
  const secret = req.headers.get('x-seed-secret')
  if (secret !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if an active agreement already exists
  const { data: existing } = await supabaseAdmin
    .from('agreements')
    .select('id, version')
    .eq('is_active', true)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({
      message: 'Active agreement already exists.',
      existing,
    })
  }

  // Check if v1.0 specifically exists (even if not active)
  const { data: v1 } = await supabaseAdmin
    .from('agreements')
    .select('id, version')
    .eq('version', AGREEMENT_VERSION)
    .maybeSingle()

  if (v1) {
    // Activate it
    await supabaseAdmin.from('agreements').update({ is_active: true }).eq('id', v1.id)
    return NextResponse.json({ message: 'Existing v1.0 activated.', id: v1.id })
  }

  // Insert fresh
  const { data, error } = await supabaseAdmin
    .from('agreements')
    .insert({
      version: AGREEMENT_VERSION,
      effective_date: 'November 2026',
      content: AGREEMENT_TEXT,
      content_hash: AGREEMENT_HASH,
      is_active: true,
      title: 'Coaching Services Agreement',
      notes: 'Initial version seeded from lib/agreement.ts',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Seeded v1.0 agreement.', id: data.id })
}
