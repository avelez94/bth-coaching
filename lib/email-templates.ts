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
export function sprintPurchaseEmail(x: { gift: boolean; name: string; email: string; phone?: string | null; amount: string; sessionRef: string }, footer: Footer): Email {
  const rows: [string, string][] = [
    ['Purchase', x.gift ? 'Gift' : 'For themselves'], [x.gift ? 'Buyer' : 'Participant', x.name || 'Not provided'],
    ['Email', x.email || 'Not provided'],
    ...(x.gift ? [] : [['Phone', x.phone || 'Not provided'] as [string, string]]),
    ['Paid', x.amount], ['Stripe reference', x.sessionRef],
  ]
  const subject = x.gift ? `8 Pillar Sprint gift purchased by ${x.name || x.email}` : `New 8 Pillar Sprint registration: ${x.name || x.email}`
  const next = x.gift
    ? `The gift certificate is emailed to ${x.email || 'the buyer'} automatically. The recipient registers by the Sprint deadline.`
    : `Next step: send ${x.name ? x.name.split(' ')[0] : 'the participant'} the welcome details and the self-assessment.`
  const body = [p(`Stripe confirmed a payment for the <strong>8 Pillar Sprint</strong>.`), table(rows), p(esc(next)), p(`All Sprint purchases are listed in Admin, Sprint Purchases.`)].join('\n')
  const text = `Stripe confirmed a payment for the 8 Pillar Sprint.

${textTable(rows)}

${next}

All Sprint purchases are listed in Admin, Sprint Purchases.${textFooter(footer)}`
  return { subject, html: layout({ preheader: subject, body, footer }), text }
}

// ------------------------------------------------------------
// 8 Pillar Sprint gifts
// ------------------------------------------------------------
type Recipient = string | null  // the real recipient when this is a test send

function giftBanner(real: Recipient): { html: string; text: string } {
  if (real === null) return { html: '', text: '' }
  const line = 'TEST MODE: Sprint test email. Outside the live site Sprint emails go only to the test inbox, never to real people.'
  return {
    html: `<div style="background:#fff3cd;border:2px solid #ffc107;padding:12px 16px;margin-bottom:20px;font-weight:bold;">${esc(line)}<br><span style="font-weight:normal">Real recipient (not sent): ${esc(real || 'none')}</span></div>`,
    text: `${line}\nReal recipient (not sent): ${real || 'none'}\n\n`,
  }
}

const button = (href: string, label: string) =>
  `<p style="margin:4px 0 22px;"><a href="${esc(href)}" style="display:inline-block;background:${C.navy};color:#ffffff;text-decoration:none;padding:12px 22px;font-size:14px;letter-spacing:0.5px;">${esc(label)}</a></p>`

/** To the purchaser, with the certificate PDF attached */
export function giftCertificateEmail(x: { purchaserName: string | null; code: string; link: string; registerBy: string; giftTerm: string }, footer: Footer, testRecipient: Recipient): Email {
  const first = (x.purchaserName ?? '').trim().split(/\s+/)[0]
  const t = giftBanner(testRecipient)
  const subject = 'Your 8 Pillar Sprint gift certificate'
  const rows: [string, string][] = [['Redemption code', x.code], ['Register by', x.registerBy]]
  const body = [
    p(first ? `Hi ${esc(first)},` : 'Hello,'),
    p('Thank you for giving the <strong>8 Pillar Sprint</strong>. Your purchase is confirmed and your gift certificate is attached as a PDF.'),
    p('<strong>To pass it along,</strong> forward this email or the attached certificate to the person you are giving it to, or print it and hand it to them. They use the link or code to claim their seat and complete their own registration.'),
    table(rows),
    button(x.link, 'Claim the Sprint seat'),
    p(`<span style="font-size:13px;color:${C.muted};">Redemption link: <a href="${esc(x.link)}" style="color:${C.mid};word-break:break-all;">${esc(x.link)}</a></span>`),
    p(`Please remind them to register by <strong>${esc(x.registerBy)}</strong>.`),
    ...(x.giftTerm ? [p(esc(x.giftTerm))] : []),
    p('If you have any questions, reply to this email.'),
  ].join('\n')
  const text = `${t.text}${first ? `Hi ${first},` : 'Hello,'}

Thank you for giving the 8 Pillar Sprint. Your purchase is confirmed and your gift certificate is attached as a PDF.

To pass it along, forward this email or the attached certificate to the person you are giving it to, or print it and hand it to them. They use the link or code to claim their seat and complete their own registration.

${textTable(rows)}
Redemption link: ${x.link}

Please remind them to register by ${x.registerBy}.
${x.giftTerm ? `\n${x.giftTerm}\n` : ''}
If you have any questions, reply to this email.${textFooter(footer)}`
  return { subject, html: layout({ preheader: 'Your gift certificate is attached.', body, footer, testBanner: t.html }), text }
}

/** To John when a gift is bought */
export function giftAdminNoticeEmail(x: { name: string; email: string; amount: string; code: string; sessionRef: string }, footer: Footer): Email {
  const rows: [string, string][] = [
    ['Purchase', 'Gift'], ['Buyer', x.name || 'Not provided'], ['Email', x.email || 'Not provided'],
    ['Paid', x.amount], ['Gift code', x.code], ['Stripe reference', x.sessionRef],
  ]
  const subject = `8 Pillar Sprint gift purchased by ${x.name || x.email}`
  const lines = [
    'Stripe confirmed a payment for an 8 Pillar Sprint gift.',
    'The gift certificate was emailed to the buyer automatically. You do not need to send anything. When the recipient claims the gift, you will get another email with their details.',
    'All gifts are listed in Admin, Sprint Purchases.',
  ]
  const body = [p(esc(lines[0])), table(rows), p(esc(lines[1])), p(esc(lines[2]))].join('\n')
  const text = `${lines[0]}\n\n${textTable(rows)}\n\n${lines[1]}\n\n${lines[2]}${textFooter(footer)}`
  return { subject, html: layout({ preheader: subject, body, footer }), text }
}

/** To the recipient after they redeem */
export function giftRedeemedRecipientEmail(x: { name: string; purchaserName: string | null; details: [string, string][] }, footer: Footer, testRecipient: Recipient): Email {
  const first = x.name.trim().split(/\s+/)[0]
  const t = giftBanner(testRecipient)
  const subject = 'You are registered for the 8 Pillar Sprint'
  const from = x.purchaserName ? `, a gift from ${x.purchaserName}` : ''
  const rows = x.details.filter(([k, v]) => k && v)
  const l1 = `Your seat in the 8 Pillar Sprint is confirmed${from}.`
  const l2 = 'I will be in touch before Week 1 with your welcome details and the self-assessment.'
  const l3 = 'If you have any questions, reply to this email.'
  const body = [p(`Hi ${esc(first)},`), p(esc(l1)), table(rows), p(esc(l2)), p(esc(l3)), p('John')].join('\n')
  const text = `${t.text}Hi ${first},\n\n${l1}\n\n${textTable(rows)}\n\n${l2}\n\n${l3}\n\nJohn${textFooter(footer)}`
  return { subject, html: layout({ preheader: l1, body, footer, testBanner: t.html }), text }
}

/** To someone who registered and paid for the Sprint themselves */
export function sprintRegisteredEmail(x: { name: string; details: [string, string][] }, footer: Footer, testRecipient: Recipient): Email {
  const first = x.name.trim().split(/\s+/)[0]
  const t = giftBanner(testRecipient)
  const subject = 'You are registered for the 8 Pillar Sprint'
  const rows = x.details.filter(([k, v]) => k && v)
  const l1 = 'Your payment is confirmed and your seat in the 8 Pillar Sprint is reserved.'
  const l2 = 'I will be in touch before Week 1 with your welcome details and the self-assessment.'
  const l3 = 'If you have any questions, reply to this email.'
  const body = [p(`Hi ${esc(first)},`), p(esc(l1)), table(rows), p(esc(l2)), p(esc(l3)), p('John')].join('\n')
  const text = `${t.text}Hi ${first},\n\n${l1}\n\n${textTable(rows)}\n\n${l2}\n\n${l3}\n\nJohn${textFooter(footer)}`
  return { subject, html: layout({ preheader: l1, body, footer, testBanner: t.html }), text }
}

/** To John after a recipient redeems */
export function giftRedeemedAdminEmail(x: { recipientName: string; recipientEmail: string; recipientPhone: string | null; purchaserName: string; purchaserEmail: string; code: string }, footer: Footer): Email {
  const rows: [string, string][] = [
    ['Participant', x.recipientName], ['Email', x.recipientEmail], ['Phone', x.recipientPhone || 'Not provided'],
    ['Gift from', [x.purchaserName, x.purchaserEmail].filter(Boolean).join(', ') || 'Not provided'], ['Gift code', x.code],
  ]
  const first = x.recipientName.trim().split(/\s+/)[0] || 'the participant'
  const subject = `8 Pillar Sprint gift redeemed: ${x.recipientName}`
  const lines = [
    'A Sprint gift was just claimed. The recipient registered with these details.',
    `Next step: send ${first} the welcome details and the self-assessment.`,
    'The gift now shows as Redeemed in Admin, Sprint Purchases, and cannot be claimed again.',
  ]
  const body = [p(esc(lines[0])), table(rows), p(esc(lines[1])), p(esc(lines[2]))].join('\n')
  const text = `${lines[0]}\n\n${textTable(rows)}\n\n${lines[1]}\n\n${lines[2]}${textFooter(footer)}`
  return { subject, html: layout({ preheader: subject, body, footer }), text }
}

// ------------------------------------------------------------
// Contact form
// ------------------------------------------------------------
export function contactAdminEmail(x: { name: string; email: string; phone?: string; organization?: string; message: string }, footer: Footer): Email {
  const rows: [string, string][] = [['Name', x.name], ['Email', x.email], ...(x.phone ? [['Phone', x.phone] as [string, string]] : []), ...(x.organization ? [['Organization', x.organization] as [string, string]] : [])]
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

// ------------------------------------------------------------
// Admin accounts: password reset, invitations, security notices.
// Links carry a single use token after "#", so it never reaches a
// server log. No password is ever included in an email.
// ------------------------------------------------------------
const adminButton = (href: string, label: string) =>
  `<p style="margin:8px 0 24px;"><a href="${esc(href)}" style="display:inline-block;background:${C.navy};color:#ffffff;text-decoration:none;padding:12px 22px;font-weight:bold;">${esc(label)}</a></p>`
const ignoreNote = 'If you did not expect this email, you can ignore it. Nothing changes unless the link is used.'

export function adminResetEmail(x: { name: string | null; link: string; minutes: number }, footer: Footer): Email {
  const subject = 'Reset your website Admin password'
  const hello = x.name ? `Hello ${x.name},` : 'Hello,'
  const body = [
    p(esc(hello)),
    p('Someone asked to reset the password for your Beyond the Horizon website Admin account. Use the button below to choose a new password.'),
    adminButton(x.link, 'Choose a new password'),
    p(`This link works once and expires in ${x.minutes} minutes.`),
    p(esc(ignoreNote)),
  ].join('\n')
  const text = `${hello}\n\nSomeone asked to reset the password for your Beyond the Horizon website Admin account. Open this link to choose a new password:\n\n${x.link}\n\nThis link works once and expires in ${x.minutes} minutes.\n\n${ignoreNote}${textFooter(footer)}`
  return { subject, html: layout({ preheader: subject, body, footer }), text }
}

export function adminInviteEmail(x: { inviterName: string; link: string; expires: string }, footer: Footer): Email {
  const subject = 'You have been given Developer access to the Beyond the Horizon website'
  const body = [
    p('Hello,'),
    p(`${esc(x.inviterName)} has invited you to the Beyond the Horizon website Admin as a Developer. Use the button below to set your own password and activate your account.`),
    adminButton(x.link, 'Accept invitation'),
    p(`This invitation works once and expires on ${esc(x.expires)}.`),
    p(esc(ignoreNote)),
  ].join('\n')
  const text = `Hello,\n\n${x.inviterName} has invited you to the Beyond the Horizon website Admin as a Developer. Open this link to set your own password and activate your account:\n\n${x.link}\n\nThis invitation works once and expires on ${x.expires}.\n\n${ignoreNote}${textFooter(footer)}`
  return { subject, html: layout({ preheader: subject, body, footer }), text }
}

export function adminPasswordChangedEmail(x: { name: string | null; when: string; how: 'changed' | 'reset' }, footer: Footer): Email {
  const subject = 'Your website Admin password was changed'
  const hello = x.name ? `Hello ${x.name},` : 'Hello,'
  const line = `The password for your Beyond the Horizon website Admin account was ${x.how === 'reset' ? 'reset' : 'changed'} on ${x.when}. Every device that was signed in has been signed out.`
  const warn = 'If this was not you, use Forgot password on the Admin sign in page right away to choose a new one.'
  const body = [p(esc(hello)), p(esc(line)), p(esc(warn))].join('\n')
  const text = `${hello}\n\n${line}\n\n${warn}${textFooter(footer)}`
  return { subject, html: layout({ preheader: subject, body, footer }), text }
}

export function adminAccessNoticeEmail(x: { line: string }, footer: Footer): Email {
  const subject = 'Website Admin access update'
  const body = [p('Hello,'), p(esc(x.line)), p('You can review everyone with access under Users & Access in your website Admin.')].join('\n')
  const text = `Hello,\n\n${x.line}\n\nYou can review everyone with access under Users & Access in your website Admin.${textFooter(footer)}`
  return { subject, html: layout({ preheader: subject, body, footer }), text }
}
