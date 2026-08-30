import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, interest, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Beyond the Horizon <john@mccrackencoaching.com>',
      to: 'john@mccrackencoaching.com',
      replyTo: email,
      subject: `New inquiry from ${name}${interest ? ' — ' + interest : ''}`,
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{background:#F7F4ED;font-family:Georgia,serif;padding:48px 24px}.logo{font-family:serif;font-size:1.1rem;font-weight:700;color:#0D1B2A;margin-bottom:4px}.sub{font-size:0.65rem;color:#C9A23A;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:40px}.divider{height:1px;background:rgba(13,27,42,0.1);margin:32px 0}h2{font-family:serif;font-size:1.8rem;font-weight:600;color:#0D1B2A;margin-bottom:20px}h2 em{font-style:italic;color:#C9A23A}.detail{margin-bottom:8px;font-size:0.9rem;color:#2C3E50}.label{font-size:0.65rem;color:#C9A23A;letter-spacing:0.12em;text-transform:uppercase;margin-top:16px;margin-bottom:4px}.message-box{background:white;border:1px solid rgba(13,27,42,0.08);border-left:3px solid #C9A23A;padding:20px 24px;margin-top:24px;font-size:0.92rem;line-height:1.75;color:#2C3E50}</style></head>
<body>
<div class="logo">Beyond the Horizon</div>
<div class="sub">Executive Coaching and Consulting</div>
<div class="divider"></div>
<h2>New inquiry from <em>${name}</em></h2>
<div class="label">Name</div><div class="detail">${name}</div>
<div class="label">Email</div><div class="detail"><a href="mailto:${email}">${email}</a></div>
${phone ? `<div class="label">Phone</div><div class="detail">${phone}</div>` : ''}
${interest ? `<div class="label">Interested in</div><div class="detail">${interest}</div>` : ''}
<div class="label">Message</div>
<div class="message-box">${message.replace(/\n/g, '<br>')}</div>
</body></html>`,
    })

    await resend.emails.send({
      from: 'John McCracken <john@mccrackencoaching.com>',
      to: email,
      subject: 'Thank you for reaching out — Beyond the Horizon',
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{background:#F7F4ED;font-family:Georgia,serif;padding:48px 24px}.logo{font-family:serif;font-size:1.1rem;font-weight:700;color:#0D1B2A;margin-bottom:4px}.sub{font-size:0.65rem;color:#C9A23A;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:40px}.divider{height:1px;background:rgba(13,27,42,0.1);margin:32px 0}h1{font-family:serif;font-size:2rem;font-weight:600;line-height:1.1;color:#0D1B2A;margin-bottom:20px}h1 em{font-style:italic;color:#C9A23A}p{font-size:0.95rem;line-height:1.8;color:#2C3E50;margin-bottom:16px}.footer{margin-top:48px;padding-top:24px;border-top:1px solid rgba(13,27,42,0.1);font-size:0.75rem;color:#6B7A8D}</style></head>
<body>
<div class="logo">Beyond the Horizon</div>
<div class="sub">Executive Coaching and Consulting</div>
<div class="divider"></div>
<h1>Thank you,<br /><em>${name}.</em></h1>
<p>I have received your message and will be in touch within one business day.</p>
<p>If you would like to reach me directly in the meantime, feel free to call or text at 703.343.6960.</p>
<p>Looking forward to connecting.</p>
<p>John McCracken<br />Founder, Beyond the Horizon</p>
<div class="footer">john@mccrackencoaching.com &nbsp;·&nbsp; 703.343.6960 &nbsp;·&nbsp; mccrackencoaching.com</div>
</body></html>`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}