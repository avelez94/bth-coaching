import { NextRequest, NextResponse } from 'next/server'
import { getSettings } from '@/lib/site-data'
import { adminRecipient, sendEmail } from '@/lib/email'
import { contactAdminEmail, contactSenderEmail } from '@/lib/email-templates'
import { attempts, clientIp, recordAttempt } from '@/lib/admin-auth'

// Spam limits: a few messages an hour from one connection, fewer to one
// address, so the form cannot flood John's inbox or be used to send
// confirmations to strangers.
const PER_IP_HOUR = 5
const PER_EMAIL_HOUR = 3
const MIN_FILL_MS = 2500

// POST /api/contact: the Contact page form. Sends the message to John
// (reply goes straight to the visitor) and a short confirmation to the
// visitor. Addresses come from environment variables and Site Settings.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const name = String(body?.name ?? '').trim()
    const email = String(body?.email ?? '').trim()
    const phone = String(body?.phone ?? '').trim()
    const organization = String(body?.organization ?? '').trim()
    const message = String(body?.message ?? '').trim()

    // Bots: the hidden field is filled in, or the form was sent the instant
    // it loaded. Answer as if it worked so they learn nothing; send nothing.
    const elapsed = Number(body?.elapsedMs)
    if (String(body?.website ?? '').trim() || (Number.isFinite(elapsed) && elapsed < MIN_FILL_MS)) {
      return NextResponse.json({ success: true })
    }

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.replace(/\D/g, '').length < 10 || phone.length > 40 || name.length > 200 || organization.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 })
    }

    const ip = clientIp(req)
    if ((await attempts('contact-ip', ip, 60)) >= PER_IP_HOUR || (await attempts('contact-email', email, 60)) >= PER_EMAIL_HOUR) {
      return NextResponse.json({ error: 'Too many messages for now. Please try again in an hour, or email directly.' }, { status: 429 })
    }
    await recordAttempt('contact-ip', ip)
    await recordAttempt('contact-email', email)

    const settings = await getSettings()
    const footer = { contactEmail: settings.contactEmail, phone: settings.phone }
    const toJohn = await sendEmail({
      kind: 'contact_admin', to: adminRecipient(settings), replyTo: email,
      ...contactAdminEmail({ name, email, phone, organization, message }, footer),
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
