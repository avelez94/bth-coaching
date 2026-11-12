import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { generateAgreementPDF } from '@/lib/generate-agreement-pdf'
import { AGREEMENT_HASH, AGREEMENT_VERSION, AGREEMENT_TEXT } from '@/lib/agreement'

// Admin client — bypasses RLS, used server-side only
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

const STRIPE_LINKS: Record<string, Record<string, string>> = {
  'executive-coaching': {
    full: 'https://buy.stripe.com/8x23cvf9P9Dva6H1Gc3sI00',
    installment: 'https://buy.stripe.com/28E4gze5L5nfgv5gB63sI01',
  },
  '8-pillars': {
    full: 'https://buy.stripe.com/9B6fZh5zf5nf6Uvfx23sI02',
    installment: 'https://buy.stripe.com/7sY28r3r77vn4MnesY3sI03',
  },
}

const PROGRAM_LABELS: Record<string, string> = {
  'executive-coaching': 'Executive Coaching',
  '8-pillars': '8 Pillars Leadership Program',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      program,
      paymentOption,
      firstName,
      lastName,
      email,
      phone,
      organization,
      role,
      signatureData,
      signatureType,
    } = body

    // Basic validation
    if (!program || !paymentOption || !firstName || !lastName || !email || !signatureData || !signatureType) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }
    if (!['executive-coaching', '8-pillars'].includes(program)) {
      return NextResponse.json({ error: 'Invalid program.' }, { status: 400 })
    }
    if (!['full', 'installment'].includes(paymentOption)) {
      return NextResponse.json({ error: 'Invalid payment option.' }, { status: 400 })
    }

    const signedAt = new Date()

    // 0. Fetch the active agreement version from the database.
    //    Falls back to the hardcoded lib/agreement.ts values if the
    //    agreements table is empty (e.g. before the seed has run).
    let activeAgreementId: string | null = null
    let activeAgreementContent: string = AGREEMENT_TEXT
    let activeAgreementVersion: string = AGREEMENT_VERSION
    let activeAgreementHash: string = AGREEMENT_HASH

    const { data: activeAgreement } = await supabaseAdmin
      .from('agreements')
      .select('id, content, version, content_hash')
      .eq('is_active', true)
      .maybeSingle()

    if (activeAgreement) {
      activeAgreementId = activeAgreement.id
      activeAgreementContent = activeAgreement.content
      activeAgreementVersion = activeAgreement.version
      activeAgreementHash = activeAgreement.content_hash
    }

    // 1. Generate signed PDF
    const pdfBytes = await generateAgreementPDF({
      firstName,
      lastName,
      email,
      phone,
      organization,
      role,
      program,
      paymentOption,
      signatureData,
      signatureType,
      signedAt,
    })

    // 2. Upload PDF to Supabase Storage
    const fileName = `${signedAt.getTime()}-${lastName.toLowerCase().replace(/\s+/g, '-')}-${firstName.toLowerCase().replace(/\s+/g, '-')}.pdf`
    const storagePath = `agreements/${fileName}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from('signed-agreements')
      .upload(storagePath, pdfBytes, {
        contentType: 'application/pdf',
        upsert: false,
      })

    if (uploadError) {
      console.error('PDF upload error:', uploadError)
      // Don't block enrollment if storage fails — record still goes in
    }

    // 3. Create signed download URL (1-hour window for confirmation page)
    let pdfDownloadUrl: string | null = null
    if (!uploadError) {
      const { data: signedUrl } = await supabaseAdmin.storage
        .from('signed-agreements')
        .createSignedUrl(storagePath, 3600)
      pdfDownloadUrl = signedUrl?.signedUrl ?? null
    }

    // 4. Insert enrollment record
    const { data: enrollment, error: insertError } = await supabaseAdmin
      .from('enrollments')
      .insert({
        program,
        payment_option: paymentOption,
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        organization: organization || null,
        role: role || null,
        signature_data: signatureType === 'typed' ? signatureData : '[drawn — stored in PDF]',
        signature_type: signatureType,
        signed_at: signedAt.toISOString(),
        agreement_version: activeAgreementVersion,
        agreement_hash: activeAgreementHash,
        agreement_id: activeAgreementId,
        agreement_content_snapshot: activeAgreementContent,
        pdf_path: uploadError ? null : storagePath,
        status: 'pending_payment',
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Enrollment insert error:', insertError)
      return NextResponse.json({ error: 'Could not save enrollment. Please try again.' }, { status: 500 })
    }

    const enrollmentId = enrollment.id

    // 5. Send emails via Resend
    const programLabel = PROGRAM_LABELS[program] || program

    // Email to John
    await resend.emails.send({
      from: 'BTH Coaching <noreply@mccrackencoaching.com>',
      to: 'john@mccrackencoaching.com',
      subject: `New Enrollment: ${firstName} ${lastName} — ${programLabel}`,
      html: `
        <p>A new enrollment has been submitted.</p>
        <table style="border-collapse:collapse;width:100%;max-width:560px">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td><td style="padding:8px;border:1px solid #ddd">${firstName} ${lastName}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${email}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #ddd">${phone || 'Not provided'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Organization</td><td style="padding:8px;border:1px solid #ddd">${organization || 'Not provided'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Role</td><td style="padding:8px;border:1px solid #ddd">${role || 'Not provided'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Program</td><td style="padding:8px;border:1px solid #ddd">${programLabel}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Payment</td><td style="padding:8px;border:1px solid #ddd">${paymentOption === 'full' ? 'Full payment' : 'Installment plan'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Signed at</td><td style="padding:8px;border:1px solid #ddd">${signedAt.toUTCString()}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Enrollment ID</td><td style="padding:8px;border:1px solid #ddd">${enrollmentId}</td></tr>
        </table>
        <p style="margin-top:16px;color:#666;font-size:12px">The signed agreement PDF is stored in Supabase Storage at: ${storagePath}</p>
      `,
    }).catch(e => console.error('Admin email error:', e))

    // Confirmation email to client
    await resend.emails.send({
      from: 'John McCracken <john@mccrackencoaching.com>',
      to: email,
      subject: `Your enrollment in ${programLabel} — next step`,
      html: `
        <p>Dear ${firstName},</p>
        <p>Thank you for completing your enrollment agreement for the <strong>${programLabel}</strong>.</p>
        <p>Your signed agreement has been recorded. The next step is to complete your payment to confirm your spot.</p>
        <p>If you have any questions before completing payment, reply to this email or reach out directly.</p>
        <p>Looking forward to working with you.</p>
        <br/>
        <p>John McCracken<br/>Beyond the Horizon Executive Coaching<br/>mccrackencoaching.com</p>
        <hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
        <p style="font-size:11px;color:#999">Enrollment ID: ${enrollmentId}<br/>Agreement version: ${activeAgreementVersion}<br/>Signed: ${signedAt.toUTCString()}</p>
      `,
    }).catch(e => console.error('Client email error:', e))

    // 6. Return Stripe payment link
    const stripeLink = STRIPE_LINKS[program]?.[paymentOption] ?? ''

    return NextResponse.json({
      success: true,
      enrollmentId,
      pdfDownloadUrl,
      stripeLink,
    })
  } catch (err) {
    console.error('Enroll submit error:', err)
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 })
  }
}
