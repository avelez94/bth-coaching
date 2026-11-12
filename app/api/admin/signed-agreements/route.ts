import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminToken } from '@/lib/admin-auth'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/admin/signed-agreements
// Returns all enrollment records for the admin dashboard
export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('enrollments')
    .select(`
      id,
      created_at,
      first_name,
      last_name,
      email,
      phone,
      organization,
      role,
      program,
      payment_option,
      signed_at,
      agreement_version,
      agreement_hash,
      agreement_id,
      pdf_path,
      status,
      test_mode
    `)
    .order('signed_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Generate signed PDF download URLs for records that have a pdf_path
  const withUrls = await Promise.all(
    (data || []).map(async (enrollment) => {
      let pdfUrl: string | null = null
      if (enrollment.pdf_path) {
        const { data: signedUrl } = await supabaseAdmin.storage
          .from('signed-agreements')
          .createSignedUrl(enrollment.pdf_path, 3600)
        pdfUrl = signedUrl?.signedUrl ?? null
      }
      return { ...enrollment, pdfUrl }
    })
  )

  return NextResponse.json({ enrollments: withUrls })
}
