import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Email to John
    await resend.emails.send({
      from: 'Beyond the Horizon <noreply@mccrackencoaching.com>',
      to: 'john@mccrackencoaching.com',
      replyTo: email,
      subject: `New message from ${name}`,
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  body { background: #F7F4ED; font-family: Georgia, serif; padding: 48px 24px; color: #1C2B3A; }
  .brand { font-family: Georgia, serif; font-size: 1rem; font-weight: 700; color: #0D1B2A; margin-bottom: 2px; }
  .brand-sub { font-size: 0.65rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 36px; }
  .divider { height: 1px; background: rgba(28,43,58,0.1); margin: 28px 0; }
  h2 { font-size: 1.4rem; font-weight: 600; color: #0D1B2A; margin-bottom: 24px; }
  .label { font-size: 0.65rem; color: #6B7A8D; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 16px; margin-bottom: 4px; }
  .value { font-size: 0.92rem; color: #1C2B3A; }
  .value a { color: #3A607F; text-decoration: none; }
  .message-box { margin-top: 8px; padding: 20px 24px; background: #EDE8DC; border-left: 2px solid #4C78A0; font-size: 0.92rem; line-height: 1.78; color: #3D5166; }
</style>
</head>
<body>
<div class="brand">Beyond the Horizon</div>
<div class="brand-sub">Executive Coaching and Consulting</div>
<div class="divider"></div>
<h2>New message from ${name}</h2>
<div class="label">Name</div><div class="value">${name}</div>
<div class="label">Email</div><div class="value"><a href="mailto:${email}">${email}</a></div>
<div class="label">Message</div>
<div class="message-box">${message.replace(/\n/g, '<br>')}</div>
</body>
</html>`,
    })

    // Confirmation to sender
    await resend.emails.send({
      from: 'John McCracken <noreply@mccrackencoaching.com>',
      to: email,
      subject: 'Your message has been received — Beyond the Horizon',
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  body { background: #F7F4ED; font-family: Georgia, serif; padding: 48px 24px; color: #1C2B3A; }
  .brand { font-family: Georgia, serif; font-size: 1rem; font-weight: 700; color: #0D1B2A; margin-bottom: 2px; }
  .brand-sub { font-size: 0.65rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 36px; }
  .divider { height: 1px; background: rgba(28,43,58,0.1); margin: 28px 0; }
  p { font-size: 0.95rem; line-height: 1.82; color: #3D5166; margin-bottom: 16px; }
  .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid rgba(28,43,58,0.1); font-size: 0.75rem; color: #6B7A8D; }
  .footer a { color: #3A607F; text-decoration: none; }
</style>
</head>
<body>
<div class="brand">Beyond the Horizon</div>
<div class="brand-sub">Executive Coaching and Consulting</div>
<div class="divider"></div>
<p>Thank you for reaching out. Your message has been received.</p>
<p>John McCracken<br>Beyond the Horizon Executive Coaching and Consulting</p>
<div class="footer">
  <a href="mailto:john@mccrackencoaching.com">john@mccrackencoaching.com</a> &nbsp;·&nbsp; 703-705-2225 &nbsp;·&nbsp; mccrackencoaching.com
</div>
</body>
</html>`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}