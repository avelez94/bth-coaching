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
      test_mode,
      paid_at,
      amount_paid_cents,
      amount_due_today_cents,
      price_total_cents
    `)
    .order('signed_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Latest delivery result of each enrollment's two emails
  const ids = (data || []).map(e => e.id)
  const { data: logs } = ids.length
    ? await supabaseAdmin.from('email_log').select('enrollment_id, kind, status, error, created_at')
        .in('enrollment_id', ids).in('kind', ['enrollment_client', 'enrollment_admin']).order('created_at', { ascending: true })
    : { data: [] as { enrollment_id: string; kind: string; status: string; error: string | null }[] }
  const emailStatus = new Map<string, { client?: string; admin?: string; error?: string }>()
  for (const l of logs ?? []) {
    const cur = emailStatus.get(l.enrollment_id) ?? {}
    if (l.kind === 'enrollment_client') cur.client = l.status
    if (l.kind === 'enrollment_admin') cur.admin = l.status
    if (l.status !== 'sent' && l.error) cur.error = l.error
    emailStatus.set(l.enrollment_id, cur)
  }

  // Generate signed PDF download URLs for records that have a pdf_path
  const withUrls = await Promise.all(
    (data || []).map(async (enrollment) => {
      let pdfUrl: string | null = null
      let pdfDownloadUrl: string | null = null
      if (enrollment.pdf_path) {
        const fileName = `Coaching Agreement - ${enrollment.first_name} ${enrollment.last_name}.pdf`.replace(/[^\w .-]/g, '')
        const [view, download] = await Promise.all([
          supabaseAdmin.storage.from('signed-agreements').createSignedUrl(enrollment.pdf_path, 3600),
          supabaseAdmin.storage.from('signed-agreements').createSignedUrl(enrollment.pdf_path, 3600, { download: fileName }),
        ])
        pdfUrl = view.data?.signedUrl ?? null
        pdfDownloadUrl = download.data?.signedUrl ?? null
      }
      return { ...enrollment, pdfUrl, pdfDownloadUrl, email: enrollment.email, emails: emailStatus.get(enrollment.id) ?? null }
    })
  )

  return NextResponse.json({ enrollments: withUrls })
}
