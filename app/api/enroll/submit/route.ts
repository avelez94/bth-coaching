import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateAgreementPDF } from '@/lib/generate-agreement-pdf'
import { isProgramKey, withReference } from '@/lib/program-info'
import { getActiveAgreement, getPrograms, getSettings } from '@/lib/site-data'
import { adminRecipient, sendEmail, type Attachment } from '@/lib/email'
import { enrollmentAdminEmail, enrollmentClientEmail, type EnrollmentSummary } from '@/lib/email-templates'

// Admin client — bypasses RLS, used server-side only
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
      agreementHash: viewedAgreementHash,
    } = body

    // Test mode activation rule:
    //   VERCEL_ENV === 'production'  → always false, regardless of any other env var
    //   VERCEL_ENV === 'preview'     → honor ENROLLMENT_TEST_MODE=true
    //   VERCEL_ENV undefined (local) → honor ENROLLMENT_TEST_MODE=true
    // A query parameter or any browser input can never influence this — it is
    // evaluated entirely from server-side environment variables.
    const vercelEnv = process.env.VERCEL_ENV // 'production' | 'preview' | 'development' | undefined
    const isProductionDeploy = vercelEnv === 'production'
    const isTestMode = !isProductionDeploy && process.env.ENROLLMENT_TEST_MODE === 'true'

    // Basic validation
    if (!program || !paymentOption || !firstName || !lastName || !email || !signatureData || !signatureType) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }
    if (!isProgramKey(program)) {
      return NextResponse.json({ error: 'Invalid program.' }, { status: 400 })
    }
    if (!['full', 'installment'].includes(paymentOption)) {
      return NextResponse.json({ error: 'Invalid payment option.' }, { status: 400 })
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    for (const v of [firstName, lastName, phone, organization, role]) {
      if (v != null && (typeof v !== 'string' || v.length > 200)) {
        return NextResponse.json({ error: 'One of the fields is too long.' }, { status: 400 })
      }
    }
    // Current pricing and Stripe links from Admin > Pricing & Payments
    const [programs, settings] = await Promise.all([getPrograms(), getSettings()])
    const programConfig = programs[program]

    const signedAt = new Date()

    // Format signedAt in Eastern Time for display in emails and PDF.
    // The ISO timestamp is stored in the database; this is display only.
    // Intl.DateTimeFormat with timeZone 'America/New_York' automatically
    // handles EST/EDT — no manual offset math needed.
    const signedAtDisplay = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    }).format(signedAt)
    // e.g. "November 13, 2026 at 10:52 PM EST"

    // 0. The agreement new clients sign is the active version in
    //    Admin > Coaching Agreement (falls back to lib/agreement.ts).
    const active = await getActiveAgreement()
    const activeAgreementId = active.id
    const activeAgreementContent = active.content
    const activeAgreementVersion = active.version
    const activeAgreementHash = active.hash

    // The client must sign the exact text they read. If John activated a new
    // version while this client was on the page, ask them to review it.
    if (viewedAgreementHash && viewedAgreementHash !== activeAgreementHash) {
      return NextResponse.json({
        error: 'The coaching agreement was just updated. Please refresh the page to review the current version before signing.',
      }, { status: 409 })
    }

    // 1. Generate signed PDF — pass the active agreement fields so the PDF
    //    reflects exactly what the client reviewed, not a hardcoded fallback.
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
      agreementVersion: activeAgreementVersion,
      agreementHash: activeAgreementHash,
      agreementContent: activeAgreementContent,
      coachEmail: settings.contactEmail,
      coachPhone: settings.phone,
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
        .createSignedUrl(storagePath, 31536000) // 1 year
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
        status: isTestMode ? 'test' : 'pending_payment',
        test_mode: isTestMode,
        // Price at the moment of signing; later price changes never alter this record
        price_total_cents: programConfig.fullPriceCents,
        price_installment_cents: programConfig.installmentAmountCents,
        price_installment_count: programConfig.installmentCount,
        amount_due_today_cents: paymentOption === 'full' ? programConfig.fullPriceCents : programConfig.installmentAmountCents,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Enrollment insert error:', insertError)
      return NextResponse.json({ error: 'Could not save enrollment. Please try again.' }, { status: 500 })
    }

    const enrollmentId = enrollment.id

    // 5. Emails, through lib/email (addresses come from environment
    //    variables and Site Settings, never from code). Both carry the
    //    signed PDF. In test mode both go to ENROLLMENT_TEST_EMAIL only;
    //    if that is not set, nothing is sent (the attempt is logged).
    //    A failed email is logged and never undoes the enrollment.
    const programLabel = programConfig.label
    const testEmailRecipient = process.env.ENROLLMENT_TEST_EMAIL?.trim() || null
    const shouldSendEmail = isTestMode ? testEmailRecipient !== null : true
    const summary: EnrollmentSummary = {
      enrollmentId, firstName, lastName, email, phone, organization, role, programLabel,
      paymentLabel: paymentOption === 'full' ? `Pay in full, ${programConfig.fullPrice}` : programConfig.installmentNote,
      totalPrice: programConfig.totalCost,
      amountToday: paymentOption === 'full' ? programConfig.fullPrice : programConfig.installmentAmount,
      signedAtDisplay,
      agreementVersion: activeAgreementVersion,
    }
    const attachments: Attachment[] = [{
      filename: `Coaching Services Agreement (${firstName} ${lastName}).pdf`.replace(/[^\w ().,'-]/g, ''),
      content: Buffer.from(pdfBytes),
    }]
    const footer = { contactEmail: settings.contactEmail, phone: settings.phone }
    const testNote = isTestMode ? email : undefined
    const clientMail = enrollmentClientEmail(summary, footer, testNote)
    const adminMail = enrollmentAdminEmail(summary, footer, testNote)

    if (!shouldSendEmail) {
      console.warn(`[TEST MODE] ENROLLMENT_TEST_EMAIL is not set. Skipping email delivery for enrollment ${enrollmentId}.`)
    }
    const [clientResult, adminResult] = await Promise.all([
      sendEmail({
        kind: 'enrollment_client', enrollmentId, testMode: isTestMode, attachments,
        to: isTestMode ? (testEmailRecipient ?? '') : email,
        replyTo: settings.contactEmail,
        ...clientMail,
      }),
      sendEmail({
        kind: 'enrollment_admin', enrollmentId, testMode: isTestMode, attachments,
        to: isTestMode ? (testEmailRecipient ?? '') : adminRecipient(settings),
        replyTo: email,
        ...adminMail,
      }),
    ])

    // 6. Resolve Stripe payment link from centralized program config.
    // In test mode: return testMode:true and testStripeDestination (domain only, not the full link).
    // The client will show a test confirmation screen instead of redirecting.
    // The enrollment ID rides along as Stripe's client_reference_id, so the
    // payment webhook can mark exactly this enrollment as paid. Reaching
    // Stripe does not mark anything paid.
    const baseStripeLink = programConfig.stripeLinks[paymentOption as 'full' | 'installment'] ?? ''
    const resolvedStripeLink = baseStripeLink ? withReference(baseStripeLink, enrollmentId, email) : ''

    if (isTestMode) {
      // Build a human-readable routing label that confirms which of the four
      // Stripe configurations was resolved — without exposing the actual URL.
      // Format: "<Program> — <Payment schedule>"
      const paymentRouteLabel = paymentOption === 'full'
        ? `${programLabel} — Pay in Full — ${programConfig.fullPrice}`
        : `${programLabel} — ${programConfig.installmentCount} Monthly Payments of ${programConfig.installmentAmount}`

      // Confirm a Stripe link is configured without revealing it
      const stripeConfigured = Boolean(resolvedStripeLink)

      return NextResponse.json({
        success: true,
        enrollmentId,
        pdfDownloadUrl,
        stripeLink: null,
        testMode: true,
        testPaymentRouteLabel: paymentRouteLabel,
        testStripeConfigured: stripeConfigured,
        testProgramLabel: programLabel,
        testPaymentOption: paymentOption === 'full' ? 'Pay in Full' : `${programConfig.installmentCount} Monthly Payments of ${programConfig.installmentAmount}`,
        testEmailRecipient: testEmailRecipient ?? null,
        testEmailSuppressed: !shouldSendEmail,
        testEmailResults: { client: clientResult.status, admin: adminResult.status },
      })
    }

    return NextResponse.json({
      success: true,
      enrollmentId,
      pdfDownloadUrl,
      stripeLink: resolvedStripeLink,
    })
  } catch (err) {
    console.error('Enroll submit error:', err)
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 })
  }
}
