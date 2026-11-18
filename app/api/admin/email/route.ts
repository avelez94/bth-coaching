import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { db, getSettings } from '@/lib/site-data'
import { adminRecipient, emailSetupProblems, fromAddress, sendEmail } from '@/lib/email'
import { setupTestEmail } from '@/lib/email-templates'

// GET /api/admin/email: is email set up, who it comes from and goes to,
// and the most recent send attempts (for diagnosing problems).
export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const settings = await getSettings()
  const { data } = await db().from('email_log')
    .select('created_at, kind, recipient, subject, status, error, test_mode')
    .order('created_at', { ascending: false }).limit(15)
  return NextResponse.json({
    ready: emailSetupProblems().length === 0,
    problems: emailSetupProblems(),
    from: fromAddress(),
    notificationsTo: adminRecipient(settings),
    recent: data ?? [],
  })
}

// POST /api/admin/email: send a short test email to the notification address
export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // TEMPORARY (launch QA): a plain delivery test to one named address. Removed after use.
  const body = await req.json().catch(() => ({})) as { deliveryTestTo?: unknown }
  if (typeof body.deliveryTestTo === 'string') {
    const to = body.deliveryTestTo.trim()
    if (!/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(to) || to.length > 254) return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
    const line = 'This is a technical delivery test for Beyond the Horizon. No action is needed.'
    const r = await sendEmail({ kind: 'test', to, subject: 'BTH Email Delivery Test, No Action Needed', text: line, html: `<p>${line}</p>` })
    return NextResponse.json(r, { status: r.status === 'sent' ? 200 : 502 })
  }
  const settings = await getSettings()
  const to = adminRecipient(settings)
  const result = await sendEmail({ kind: 'test', to, ...setupTestEmail({ contactEmail: settings.contactEmail, phone: settings.phone }) })
  if (result.status !== 'sent') return NextResponse.json({ error: result.error ?? 'The test email could not be sent.' }, { status: 502 })
  return NextResponse.json({ success: true, to })
}
