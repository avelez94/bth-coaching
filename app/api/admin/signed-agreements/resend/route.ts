import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = req.headers.get('x-admin-token')
  if (!token) return false
  const res = await fetch(new URL('/api/admin/auth', req.url), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: token }),
  })
  return res.ok
}

// POST /api/admin/signed-agreements/resend
// Resends a signed agreement copy to the client
// Body: { enrollmentId }
export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { enrollmentId } = await req.json()
  if (!enrollmentId) {
    return NextResponse.json({ error: 'enrollmentId is required.' }, { status: 400 })
  }

  const { data: enrollment, error } = await supabaseAdmin
    .from('enrollments')
    .select('*')
    .eq('id', enrollmentId)
    .single()

  if (error || !enrollment) {
    return NextResponse.json({ error: 'Enrollment not found.' }, { status: 404 })
  }

  const programLabels: Record<string, string> = {
    'executive-coaching': 'Executive Coaching',
    '8-pillars': '8 Pillars Leadership Program',
  }
  const programLabel = programLabels[enrollment.program] || enrollment.program

  await resend.emails.send({
    from: 'John McCracken <john@mccrackencoaching.com>',
    to: enrollment.email,
    subject: `Your signed agreement for ${programLabel} (resent)`,
    html: `
      <p>Dear ${enrollment.first_name},</p>
      <p>As requested, here is a copy of your signed Coaching Services Agreement for the <strong>${programLabel}</strong>.</p>
      <p>Your agreement was signed on ${new Date(enrollment.signed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
      <p>If you have any questions, reply to this email.</p>
      <br/>
      <p>John McCracken<br/>Beyond the Horizon Executive Coaching<br/>mccrackencoaching.com</p>
      <hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
      <p style="font-size:11px;color:#999">Enrollment ID: ${enrollment.id}<br/>Agreement version: ${enrollment.agreement_version}<br/>Signed: ${new Date(enrollment.signed_at).toUTCString()}</p>
    `,
  })

  return NextResponse.json({ success: true })
}
