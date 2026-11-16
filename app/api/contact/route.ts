import { NextRequest, NextResponse } from 'next/server'
import { getSettings } from '@/lib/site-data'
import { adminRecipient, sendEmail } from '@/lib/email'
import { contactAdminEmail, contactSenderEmail } from '@/lib/email-templates'

// POST /api/contact: the Contact page form. Sends the message to John
// (reply goes straight to the visitor) and a short confirmation to the
// visitor. Addresses come from environment variables and Site Settings.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const name = String(body?.name ?? '').trim()
    const email = String(body?.email ?? '').trim()
    const organization = String(body?.organization ?? '').trim()
    const message = String(body?.message ?? '').trim()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || name.length > 200 || organization.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 })
    }

    const settings = await getSettings()
    const footer = { contactEmail: settings.contactEmail, phone: settings.phone }
    const toJohn = await sendEmail({
      kind: 'contact_admin', to: adminRecipient(settings), replyTo: email,
      ...contactAdminEmail({ name, email, organization, message }, footer),
    })
    if (toJohn.status !== 'sent') {
      return NextResponse.json({ error: 'Something went wrong' }, { status: 502 })
    }
    await sendEmail({ kind: 'contact_sender', to: email, replyTo: settings.contactEmail, ...contactSenderEmail({ name }, footer) })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
