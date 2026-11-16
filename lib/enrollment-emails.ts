import 'server-only'
import { db, getSettings } from './site-data'
import { adminRecipient, sendEmail, type Attachment, type SendResult } from './email'
import { enrollmentAdminEmail, enrollmentClientEmail, type EnrollmentSummary } from './email-templates'
import { isProgramKey, programLabel, usd } from './program-info'

// ============================================================
// Completion emails for a coaching enrollment: the client's
// confirmation and John's paid enrollment notice, both with the
// signed agreement PDF attached.
//
// Production: sent only by the Stripe webhook, once, after Stripe
// confirms payment. Nothing is emailed when someone signs and is sent
// to Stripe, so an abandoned checkout never produces these emails.
// Preview/local test mode (which never goes to Stripe): sent at signing,
// to ENROLLMENT_TEST_EMAIL only.
// ============================================================

export interface EnrollmentRow {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  organization: string | null
  role: string | null
  program: string
  payment_option: 'full' | 'installment'
  signed_at: string
  agreement_version: string
  pdf_path: string | null
  price_total_cents: number | null
  price_installment_cents: number | null
  price_installment_count: number | null
  amount_due_today_cents: number | null
  amount_paid_cents?: number | null
}

export const ENROLLMENT_EMAIL_COLUMNS =
  'id, first_name, last_name, email, phone, organization, role, program, payment_option, signed_at, agreement_version, pdf_path, price_total_cents, price_installment_cents, price_installment_count, amount_due_today_cents, amount_paid_cents'

function summaryOf(e: EnrollmentRow): EnrollmentSummary {
  const total = e.price_total_cents ?? 0
  const paidToday = e.amount_paid_cents ?? e.amount_due_today_cents ?? 0
  return {
    enrollmentId: e.id,
    firstName: e.first_name,
    lastName: e.last_name,
    email: e.email,
    phone: e.phone,
    organization: e.organization,
    role: e.role,
    programLabel: isProgramKey(e.program) ? programLabel(e.program) : e.program,
    paymentLabel: e.payment_option === 'full'
      ? `Pay in full, ${usd(total)}`
      : `${e.price_installment_count} monthly payments of ${usd(e.price_installment_cents ?? 0)}`,
    totalPrice: usd(total),
    amountToday: usd(paidToday),
    signedAtDisplay: new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York', year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short',
    }).format(new Date(e.signed_at)),
    agreementVersion: e.agreement_version,
  }
}

export async function sendCompletionEmails(
  e: EnrollmentRow,
  opts: { testMode: boolean; pdf?: Uint8Array },
): Promise<{ client: SendResult; admin: SendResult }> {
  const settings = await getSettings()
  const footer = { contactEmail: settings.contactEmail, phone: settings.phone }
  const summary = summaryOf(e)

  // The signed PDF exactly as stored at signing
  let pdf: Buffer | null = opts.pdf ? Buffer.from(opts.pdf) : null
  if (!pdf && e.pdf_path) {
    const { data: file } = await db().storage.from('signed-agreements').download(e.pdf_path)
    if (file) pdf = Buffer.from(await file.arrayBuffer())
  }
  if (!pdf) console.error(`[enrollment ${e.id}] signed PDF not found; completion emails go without it`)
  const attachments: Attachment[] | undefined = pdf
    ? [{ filename: `Coaching Services Agreement (${e.first_name} ${e.last_name}).pdf`.replace(/[^\w ().,'-]/g, ''), content: pdf }]
    : undefined

  const testTo = process.env.ENROLLMENT_TEST_EMAIL?.trim() || ''
  const testNote = opts.testMode ? e.email : undefined
  const [client, admin] = await Promise.all([
    sendEmail({
      kind: 'enrollment_client', enrollmentId: e.id, testMode: opts.testMode, attachments,
      to: opts.testMode ? testTo : e.email,
      replyTo: settings.contactEmail,
      ...enrollmentClientEmail(summary, footer, testNote),
    }),
    sendEmail({
      kind: 'enrollment_admin', enrollmentId: e.id, testMode: opts.testMode, attachments,
      to: opts.testMode ? testTo : adminRecipient(settings),
      replyTo: e.email,
      ...enrollmentAdminEmail(summary, footer, testNote),
    }),
  ])
  return { client, admin }
}
