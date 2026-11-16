import type { SiteSettings } from './site-settings'
import { SITE_URL } from './seo'

// ============================================================
// Transactional email templates: plain, branded, readable in any
// mail app. Every value from a visitor or the database is escaped.
// Each template returns a subject, HTML, and a plain text version.
// No dashes used as punctuation in anything a client reads.
// ============================================================

export interface Email { subject: string; html: string; text: string }

export function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

const C = { ivory: '#F7F4ED', ivoryDark: '#EDE8DC', navy: '#0D1B2A', text: '#1C2B3A', mid: '#3D5166', muted: '#56657A', gold: '#C49A1F', rule: '#DDD6C7' }
const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '')

type Footer = Pick<SiteSettings, 'contactEmail' | 'phone'>

function layout(opts: { preheader: string; body: string; footer: Footer; testBanner?: string }): string {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Beyond the Horizon</title></head>
<body style="margin:0;padding:0;background:${C.ivory};">
<span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden">${esc(opts.preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ivory};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${C.rule};">
<tr><td style="padding:28px 32px 20px;border-bottom:3px solid ${C.gold};">
<div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:${C.navy};">Beyond the Horizon</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};margin-top:4px;">Executive Coaching &amp; Consulting</div>
</td></tr>
<tr><td style="padding:28px 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:${C.text};">
${opts.testBanner ?? ''}${opts.body}
</td></tr>
<tr><td style="padding:18px 32px 26px;border-top:1px solid ${C.rule};font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${C.muted};">
John McCracken, Beyond the Horizon Executive Coaching &amp; Consulting<br>
<a href="mailto:${esc(opts.footer.contactEmail)}" style="color:${C.mid};">${esc(opts.footer.contactEmail)}</a> &nbsp;·&nbsp; ${esc(opts.footer.phone)} &nbsp;·&nbsp; <a href="${esc(SITE_URL)}" style="color:${C.mid};">${esc(SITE_HOST)}</a>
</td></tr>
</table>
</td></tr></table>
</body></html>`
}

const p = (html: string) => `<p style="margin:0 0 16px;">${html}</p>`

function table(rows: [string, string][]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:8px 0 20px;background:${C.ivory};">
${rows.map(([k, v]) => `<tr><td style="padding:9px 14px;border-bottom:1px solid ${C.rule};font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${C.muted};width:42%;vertical-align:top;">${esc(k)}</td><td style="padding:9px 14px;border-bottom:1px solid ${C.rule};font-size:14px;color:${C.text};vertical-align:top;">${esc(v)}</td></tr>`).join('\n')}
</table>`
}

const textTable = (rows: [string, string][]) => rows.map(([k, v]) => `${k}: ${v}`).join('\n')
const textFooter = (f: Footer) => `\n\nJohn McCracken\nBeyond the Horizon Executive Coaching & Consulting\n${f.contactEmail} · ${f.phone} · ${SITE_HOST}`

export function testBannerHtml(realRecipient: string): string {
  return `<div style="background:#fff3cd;border:2px solid #ffc107;padding:12px 16px;margin-bottom:20px;font-weight:bold;">TEST MODE: this is a test enrollment. No real payment was taken; in production this email is sent only after Stripe confirms payment.<br><span style="font-weight:normal">Real recipient (not sent): ${esc(realRecipient)}</span></div>`
}
export const testBannerText = (realRecipient: string) => `TEST MODE: this is a test enrollment. No real payment was taken; in production this email is sent only after Stripe confirms payment.\nReal recipient (not sent): ${realRecipient}\n\n`

// ------------------------------------------------------------
// Enrollment: to the client, with the signed agreement attached
// ------------------------------------------------------------
export interface EnrollmentSummary {
  enrollmentId: string
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  organization?: string | null
  role?: string | null
  programLabel: string
  paymentLabel: string          // "Pay in full, $3,600" / "6 monthly payments of $600"
  totalPrice: string            // "$3,600"
  amountToday: string           // "$600"
  signedAtDisplay: string
  agreementVersion: string
}

export function enrollmentClientEmail(e: EnrollmentSummary, footer: Footer, test?: string): Email {
  const rows: [string, string][] = [
    ['Program', e.programLabel],
    ['Payment option', e.paymentLabel],
    ['Paid today', e.amountToday],
    ['Agreement signed', e.signedAtDisplay],
    ['Agreement version', e.agreementVersion],
  ]
  const subject = `${test ? '[TEST] ' : ''}Your enrollment in ${e.programLabel} is confirmed`
  const body = [
    p(`Dear ${esc(e.firstName)},`),
    p(`Thank you for enrolling in <strong>${esc(e.programLabel)}</strong>. Your payment has been received and your enrollment is confirmed. Your signed Coaching Services Agreement is attached to this email for your records.`),
    table(rows),
    p(`<strong>Next step:</strong> I will contact you to schedule your first session. Stripe sends your payment receipt separately.`),
    p(`If you have any questions, just reply to this email.`),
    p(`John McCracken`),
    `<p style="margin:16px 0 0;font-size:11px;color:${C.muted};">Reference: ${esc(e.enrollmentId)}</p>`,
  ].join('\n')
  const text = `${test ? testBannerText(test) : ''}Dear ${e.firstName},

Thank you for enrolling in ${e.programLabel}. Your payment has been received and your enrollment is confirmed. Your signed Coaching Services Agreement is attached to this email for your records.

${textTable(rows)}

Next step: I will contact you to schedule your first session. Stripe sends your payment receipt separately.

If you have any questions, just reply to this email.

John McCracken

Reference: ${e.enrollmentId}${textFooter(footer)}`
  return { subject, html: layout({ preheader: `Your enrollment in ${e.programLabel} is confirmed`, body, footer, testBanner: test ? testBannerHtml(test) : undefined }), text }
}

// ------------------------------------------------------------
// Enrollment: to John, with the signed agreement attached
// ------------------------------------------------------------
export function enrollmentAdminEmail(e: EnrollmentSummary, footer: Footer, test?: string): Email {
  const rows: [string, string][] = [
    ['Name', `${e.firstName} ${e.lastName}`],
    ['Email', e.email],
    ['Phone', e.phone || 'Not provided'],
    ['Organization', e.organization || 'Not provided'],
    ['Role', e.role || 'Not provided'],
    ['Program', e.programLabel],
    ['Payment option', e.paymentLabel],
    ['Program price', e.totalPrice],
    ['Paid today', e.amountToday],
    ['Agreement signed', e.signedAtDisplay],
    ['Agreement version', e.agreementVersion],
    ['Reference', e.enrollmentId],
  ]
  const subject = `${test ? '[TEST] ' : ''}New paid enrollment: ${e.firstName} ${e.lastName}, ${e.programLabel}`
  const first = esc(e.firstName)
  const body = [
    p(`<strong>${first} ${esc(e.lastName)}</strong> enrolled in <strong>${esc(e.programLabel)}</strong>. Stripe confirmed the payment.`),
    table(rows),
    p(`The signed agreement is attached and now shows as Completed in Admin, Signed Agreements.`),
    p(`Next step: contact ${first} to schedule the first session.`),
  ].join('\n')
  const text = `${test ? testBannerText(test) : ''}${e.firstName} ${e.lastName} enrolled in ${e.programLabel}. Stripe confirmed the payment.

${textTable(rows)}

The signed agreement is attached and now shows as Completed in Admin, Signed Agreements.

Next step: contact ${e.firstName} to schedule the first session.${textFooter(footer)}`
  return { subject, html: layout({ preheader: `${e.firstName} ${e.lastName} enrolled in ${e.programLabel}`, body, footer, testBanner: test ? testBannerHtml(test) : undefined }), text }
}

// ------------------------------------------------------------
// Admin "Resend copy": the signed agreement again, to the client
// ------------------------------------------------------------
export function resendCopyEmail(x: { firstName: string; programLabel: string; signedOn: string; agreementVersion: string; enrollmentId: string }, footer: Footer): Email {
  const subject = `Your signed agreement for ${x.programLabel}`
  const body = [
    p(`Dear ${esc(x.firstName)},`),
    p(`As requested, attached is a copy of your signed Coaching Services Agreement for <strong>${esc(x.programLabel)}</strong>, signed on ${esc(x.signedOn)}.`),
    p(`If you have any questions, just reply to this email.`),
    p(`John McCracken`),
    `<p style="margin:16px 0 0;font-size:11px;color:${C.muted};">Agreement version ${esc(x.agreementVersion)} · Reference: ${esc(x.enrollmentId)}</p>`,
  ].join('\n')
  const text = `Dear ${x.firstName},

As requested, attached is a copy of your signed Coaching Services Agreement for ${x.programLabel}, signed on ${x.signedOn}.

If you have any questions, just reply to this email.

John McCracken

Agreement version ${x.agreementVersion} · Reference: ${x.enrollmentId}${textFooter(footer)}`
  return { subject, html: layout({ preheader: `Your signed agreement for ${x.programLabel}`, body, footer }), text }
}

// ------------------------------------------------------------
// Sprint purchase (for yourself or as a gift): to John
// ------------------------------------------------------------
export function sprintPurchaseEmail(x: { gift: boolean; name: string; email: string; amount: string; sessionRef: string }, footer: Footer): Email {
  const rows: [string, string][] = [
    ['Purchase', x.gift ? 'Gift' : 'For themselves'], ['Buyer', x.name || 'Not provided'],
    ['Email', x.email || 'Not provided'], ['Paid', x.amount], ['Stripe reference', x.sessionRef],
  ]
  const subject = x.gift ? `8 Pillar Sprint gift purchased by ${x.name || x.email}` : `New 8 Pillar Sprint registration: ${x.name || x.email}`
  const next = x.gift
    ? `Next step: send the gift certificate to ${x.email || 'the buyer'} so they can pass it along. The recipient registers by the Sprint deadline.`
    : `Next step: send ${x.name ? x.name.split(' ')[0] : 'the participant'} the welcome details and the self-assessment.`
  const body = [p(`Stripe confirmed a payment for the <strong>8 Pillar Sprint</strong>.`), table(rows), p(esc(next)), p(`All Sprint purchases are listed in Admin, Sprint Purchases.`)].join('\n')
  const text = `Stripe confirmed a payment for the 8 Pillar Sprint.

${textTable(rows)}

${next}

All Sprint purchases are listed in Admin, Sprint Purchases.${textFooter(footer)}`
  return { subject, html: layout({ preheader: subject, body, footer }), text }
}

// ------------------------------------------------------------
// Contact form
// ------------------------------------------------------------
export function contactAdminEmail(x: { name: string; email: string; organization?: string; message: string }, footer: Footer): Email {
  const rows: [string, string][] = [['Name', x.name], ['Email', x.email], ...(x.organization ? [['Organization', x.organization] as [string, string]] : [])]
  const subject = `New message from ${x.name}`
  const body = [
    p(`<strong>New message from the website contact form.</strong> Reply to this email to answer ${esc(x.name)} directly.`),
    table(rows),
    `<div style="padding:16px 18px;background:${C.ivoryDark};border-left:2px solid ${C.gold};white-space:pre-wrap;">${esc(x.message)}</div>`,
  ].join('\n')
  const text = `New message from the website contact form. Reply to this email to answer ${x.name} directly.

${textTable(rows)}

${x.message}${textFooter(footer)}`
  return { subject, html: layout({ preheader: subject, body, footer }), text }
}

export function contactSenderEmail(x: { name: string }, footer: Footer): Email {
  const subject = 'Your message has been received'
  const body = [p(`Dear ${esc(x.name)},`), p('Thank you for reaching out. Your message has been received.'), p('John McCracken')].join('\n')
  const text = `Dear ${x.name},\n\nThank you for reaching out. Your message has been received.\n\nJohn McCracken${textFooter(footer)}`
  return { subject, html: layout({ preheader: subject, body, footer }), text }
}

// ------------------------------------------------------------
// Setup check (Admin > Site Settings > Send a test email)
// ------------------------------------------------------------
export function setupTestEmail(footer: Footer): Email {
  const subject = 'Test email from your website'
  const body = [p('This is a test email from the Beyond the Horizon website.'), p('If you are reading it, email sending is set up correctly.')].join('\n')
  const text = `This is a test email from the Beyond the Horizon website.\n\nIf you are reading it, email sending is set up correctly.${textFooter(footer)}`
  return { subject, html: layout({ preheader: subject, body, footer }), text }
}
