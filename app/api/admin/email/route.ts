import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { db, getSettings } from '@/lib/site-data'
import { adminRecipient, emailSetupProblems, fromAddress, sendEmail } from '@/lib/email'
import { setupTestEmail } from '@/lib/email-templates'

// GET /api/admin/email: is email set up, who it comes from and goes to,
// and the most recent send attempts (for diagnosing problems).
export async function GET(req: NextRequest) {
  if (!(await verifyAdminToken(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
  if (!(await verifyAdminToken(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const settings = await getSettings()
  const to = adminRecipient(settings)
  const result = await sendEmail({ kind: 'test', to, ...setupTestEmail({ contactEmail: settings.contactEmail, phone: settings.phone }) })
  if (result.status !== 'sent') return NextResponse.json({ error: result.error ?? 'The test email could not be sent.' }, { status: 502 })
  return NextResponse.json({ success: true, to })
}
