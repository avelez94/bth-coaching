import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { db, getSettings } from '@/lib/site-data'
import { emailSetupProblems, sendEmail } from '@/lib/email'
import { resendCopyEmail } from '@/lib/email-templates'
import { isProgramKey, programLabel, SPRINT_LABEL } from '@/lib/program-info'

// POST /api/admin/signed-agreements/resend
// Emails the client a copy of their signed agreement, attached exactly as
// it was stored at signing. Body: { enrollmentId }
export async function POST(req: NextRequest) {
  if (!(await verifyAdminToken(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { enrollmentId } = await req.json().catch(() => ({}))
  if (!enrollmentId) {
    return NextResponse.json({ error: 'enrollmentId is required.' }, { status: 400 })
  }

  const { data: enrollment, error } = await db().from('enrollments').select('*').eq('id', enrollmentId).single()
  if (error || !enrollment) {
    return NextResponse.json({ error: 'Enrollment not found.' }, { status: 404 })
  }

  // Only a completed (paid) agreement is sent. Test records (Preview only)
  // are allowed so the flow can be tested without a real payment.
  if (enrollment.status !== 'paid' && enrollment.status !== 'test') {
    return NextResponse.json({ error: 'This agreement is awaiting payment, so it is not complete yet. A copy can be sent once Stripe confirms the payment.' }, { status: 409 })
  }

  if (emailSetupProblems().length) {
    return NextResponse.json({ error: 'Email sending is not set up yet, so the copy could not be sent. Use Download and email it yourself for now.' }, { status: 503 })
  }

  let attachment: { filename: string; content: Buffer } | null = null
  if (enrollment.pdf_path) {
    const { data: file } = await db().storage.from('signed-agreements').download(enrollment.pdf_path)
    if (file) attachment = { filename: 'Coaching Services Agreement.pdf', content: Buffer.from(await file.arrayBuffer()) }
  }
  if (!attachment) {
    return NextResponse.json({ error: 'The signed PDF for this client could not be found, so nothing was sent.' }, { status: 404 })
  }

  const settings = await getSettings()
  const label = isProgramKey(enrollment.program) ? programLabel(enrollment.program) : enrollment.program === 'sprint' ? SPRINT_LABEL : enrollment.program
  const signedOn = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(enrollment.signed_at))
  const mail = resendCopyEmail(
    { firstName: enrollment.first_name, programLabel: label, signedOn, agreementVersion: enrollment.agreement_version, enrollmentId: enrollment.id },
    { contactEmail: settings.contactEmail, phone: settings.phone },
  )
  const result = await sendEmail({
    kind: 'resend_copy', enrollmentId: enrollment.id, testMode: enrollment.test_mode,
    to: enrollment.email, replyTo: settings.contactEmail, attachments: [attachment], ...mail,
  })
  if (result.status !== 'sent') {
    return NextResponse.json({ error: `The email could not be sent (${result.error ?? 'unknown error'}). Nothing was changed.` }, { status: 502 })
  }
  return NextResponse.json({ success: true })
}
