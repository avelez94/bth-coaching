import 'server-only'
import { Resend } from 'resend'
import { db } from './site-data'
import type { SiteSettings } from './site-settings'

// ============================================================
// Every email the site sends goes through sendEmail().
//
// Configuration lives only in environment variables, never in code:
//   RESEND_API_KEY         sending key (a "sending access" key is enough)
//   RESEND_FROM_EMAIL      sender, e.g. Beyond the Horizon <hello@mccrackencoaching.com>
//                          (must be on a domain verified in Resend)
//   RESEND_ADMIN_EMAIL     where John's notifications go (falls back to the
//                          contact email in Admin > Site Settings)
//   ENROLLMENT_TEST_EMAIL  Preview/local test mode only: every enrollment
//                          and Sprint gift email goes here instead of to
//                          real people
//
// Nothing here refers to a Resend account, team or user. Moving Resend
// to a different owner means a new API key in Vercel, nothing else.
//
// sendEmail() never throws. Each attempt is written to the email_log
// table (sent, failed, or skipped with the reason) and failures are also
// logged to the server console, so a problem is never silent and never
// breaks the enrollment it belongs to.
// ============================================================

export type EmailKind =
  | 'enrollment_client' | 'enrollment_admin' | 'resend_copy'
  | 'payment_received' | 'sprint_purchase'
  | 'gift_certificate' | 'gift_redeemed_recipient' | 'gift_redeemed_admin'
  | 'contact_admin' | 'contact_sender' | 'test'

export interface Attachment { filename: string; content: Buffer }

export interface SendResult {
  status: 'sent' | 'failed' | 'skipped'
  id?: string
  error?: string
}

let _resend: Resend | null = null
function client(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim()
  if (!key) return null
  if (!_resend) _resend = new Resend(key)
  return _resend
}

/** Sender address, or null if email is not configured yet */
export function fromAddress(): string | null {
  return process.env.RESEND_FROM_EMAIL?.trim() || null
}

/** Where John's notifications go */
export function adminRecipient(settings: Pick<SiteSettings, 'contactEmail'>): string {
  return process.env.RESEND_ADMIN_EMAIL?.trim() || settings.contactEmail
}

/** What is missing before email can be sent (empty when ready) */
export function emailSetupProblems(): string[] {
  const out: string[] = []
  if (!process.env.RESEND_API_KEY?.trim()) out.push('RESEND_API_KEY is not set')
  if (!fromAddress()) out.push('RESEND_FROM_EMAIL is not set')
  return out
}

export async function sendEmail(opts: {
  kind: EmailKind
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
  attachments?: Attachment[]
  enrollmentId?: string | null
  giftId?: string | null
  testMode?: boolean
}): Promise<SendResult> {
  let result: SendResult
  const resend = client()
  const from = fromAddress()

  if (!resend || !from) {
    result = { status: 'skipped', error: `Email is not set up: ${emailSetupProblems().join(', ')}.` }
  } else if (!opts.to) {
    result = { status: 'skipped', error: 'No recipient address.' }
  } else {
    try {
      const { data, error } = await resend.emails.send({
        from,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
        ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
        ...(opts.attachments?.length ? { attachments: opts.attachments } : {}),
      })
      result = error ? { status: 'failed', error: `${error.name ?? 'error'}: ${error.message}` } : { status: 'sent', id: data?.id }
    } catch (e) {
      result = { status: 'failed', error: e instanceof Error ? e.message : String(e) }
    }
  }

  if (result.status !== 'sent') {
    console.error(`[email] ${opts.kind} to ${opts.to || '(none)'} ${result.status}: ${result.error}`)
  }

  try {
    await db().from('email_log').insert({
      kind: opts.kind,
      enrollment_id: opts.enrollmentId ?? null,
      ...(opts.giftId ? { gift_id: opts.giftId } : {}),
      recipient: opts.to || null,
      subject: opts.subject,
      status: result.status,
      provider_id: result.id ?? null,
      error: result.error?.slice(0, 1000) ?? null,
      test_mode: Boolean(opts.testMode),
    })
  } catch (e) {
    console.error('[email] could not write email_log:', e)
  }
  return result
}
