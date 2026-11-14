import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { verifyAdminToken } from '@/lib/admin-auth'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

// POST /api/admin/signed-agreements/resend
// Resends a signed agreement copy to the client
// Body: { enrollmentId }
export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
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

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email sending is not set up yet, so the copy could not be sent. Use Download PDF and email it yourself for now.' }, { status: 503 })
  }

  // Attach the signed PDF exactly as it was stored at signing
  let attachments: { filename: string; content: Buffer }[] | undefined
  if (enrollment.pdf_path) {
    const { data: file } = await supabaseAdmin.storage.from('signed-agreements').download(enrollment.pdf_path)
    if (file) attachments = [{ filename: 'Coaching Services Agreement.pdf', content: Buffer.from(await file.arrayBuffer()) }]
  }
  if (!attachments) {
    return NextResponse.json({ error: 'The signed PDF for this client could not be found, so nothing was sent.' }, { status: 404 })
  }

  const signedOn = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(new Date(enrollment.signed_at))

  const { error: sendError } = await resend.emails.send({
    attachments,
    from: 'John McCracken <john@mccrackencoaching.com>',
    to: enrollment.email,
    subject: `Your signed agreement for ${programLabel} (resent)`,
    html: `
      <p>Dear ${enrollment.first_name},</p>
      <p>As requested, attached is a copy of your signed Coaching Services Agreement for the <strong>${programLabel}</strong>.</p>
      <p>Your agreement was signed on ${new Date(enrollment.signed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
      <p>If you have any questions, reply to this email.</p>
      <br/>
      <p>John McCracken<br/>Beyond the Horizon Executive Coaching<br/>mccrackencoaching.com</p>
      <hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
      <p style="font-size:11px;color:#999">Enrollment ID: ${enrollment.id}<br/>Agreement version: ${enrollment.agreement_version}<br/>Signed: ${signedOn}</p>
    `,
  })
  if (sendError) {
    return NextResponse.json({ error: 'The email could not be sent. Email sending may not be fully set up yet.' }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
