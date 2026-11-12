'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AGREEMENT_PARAGRAPHS, AGREEMENT_VERSION, AGREEMENT_IS_PLACEHOLDER } from '@/lib/agreement'
import { PROGRAM_INFO, type ProgramKey } from '@/lib/program-info'
import './enroll.css'

type Program = ProgramKey
type PaymentOption = 'full' | 'installment'
type SignatureType = 'drawn' | 'typed'
// Steps when program is pre-selected: 1=Payment, 2=Info, 3=Sign
// Steps when program is not pre-selected: 1=Choose Program+Payment, 2=Info, 3=Sign
type Step = 1 | 2 | 3 | 4

function EnrollInner() {
  const searchParams = useSearchParams()
  const rawProgram = searchParams.get('program')
  const initialProgram: Program | null =
    rawProgram === 'executive-coaching' || rawProgram === '8-pillars' ? rawProgram : null

  // When a program is pre-selected from a CTA, skip program selection (step 1)
  // and start at step 1 which becomes "Choose your payment" for the pre-selected program.
  // The stepTitles and progress labels adjust accordingly.
  const hasPreselectedProgram = initialProgram !== null

  const [step, setStep] = useState<Step>(1)
  const [program, setProgram] = useState<Program | null>(initialProgram)
  const [paymentOption, setPaymentOption] = useState<PaymentOption | null>(null)
  const [clientInfo, setClientInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    role: '',
  })
  const [signatureType, setSignatureType] = useState<SignatureType>('drawn')
  const [typedSignature, setTypedSignature] = useState('')
  const [ack1, setAck1] = useState(false)
  const [ack2, setAck2] = useState(false)
  const [ack3, setAck3] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isTestMode, setIsTestMode] = useState(false)
  const [testConfirm, setTestConfirm] = useState<null | {
    enrollmentId: string
    programLabel: string
    paymentOption: string
    paymentRouteLabel: string
    stripeConfigured: boolean
    emailRecipient: string | null
    emailSuppressed: boolean
    pdfDownloadUrl: string | null
  }>(null)

  // Fetch server-side test mode flag on mount.
  // This tells the page to show the TEST MODE banner. The flag is not
  // in a NEXT_PUBLIC_ env var — it comes from a lightweight API endpoint
  // so it cannot be set by query params or client JS.
  useEffect(() => {
    fetch('/api/enroll/test-mode')
      .then(r => r.json())
      .then(d => { if (d.testMode) setIsTestMode(true) })
      .catch(() => {})
  }, [])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const lastPoint = useRef<{ x: number; y: number } | null>(null)
  const [hasDrawn, setHasDrawn] = useState(false)

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.strokeStyle = '#0D1B2A'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [step])

  function getPos(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current
    if (!canvas) return
    isDrawing.current = true
    lastPoint.current = getPos(e, canvas)
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const pos = getPos(e, canvas)
    if (lastPoint.current) {
      ctx.beginPath()
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    }
    lastPoint.current = pos
    setHasDrawn(true)
  }

  function stopDraw() {
    isDrawing.current = false
    lastPoint.current = null
  }

  function clearSignature() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }

  function getSignatureData(): string {
    if (signatureType === 'typed') return typedSignature.trim()
    const canvas = canvasRef.current
    if (!canvas) return ''
    return canvas.toDataURL('image/png')
  }

  const signatureValid =
    signatureType === 'typed'
      ? typedSignature.trim().length >= 2
      : hasDrawn

  const step1Valid = program !== null && paymentOption !== null

  const step2Valid =
    clientInfo.firstName.trim().length > 0 &&
    clientInfo.lastName.trim().length > 0 &&
    clientInfo.email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientInfo.email)

  const step3Valid = ack1 && ack2 && ack3 && signatureValid && !AGREEMENT_IS_PLACEHOLDER

  async function handleSubmit() {
    if (!program || !paymentOption) return
    setSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/enroll/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          program,
          paymentOption,
          firstName: clientInfo.firstName.trim(),
          lastName: clientInfo.lastName.trim(),
          email: clientInfo.email.trim(),
          phone: clientInfo.phone.trim() || null,
          organization: clientInfo.organization.trim() || null,
          role: clientInfo.role.trim() || null,
          signatureData: getSignatureData(),
          signatureType,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setSubmitError(data.error || 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      // Test mode: show inline confirmation screen, never redirect to Stripe
      if (data.testMode) {
        setTestConfirm({
          enrollmentId: data.enrollmentId,
          programLabel: data.testProgramLabel,
          paymentOption: data.testPaymentOption,
          paymentRouteLabel: data.testPaymentRouteLabel,
          stripeConfigured: data.testStripeConfigured,
          emailRecipient: data.testEmailRecipient,
          emailSuppressed: data.testEmailSuppressed,
          pdfDownloadUrl: data.pdfDownloadUrl,
        })
        setSubmitting(false)
        return
      }

      // Store confirmation data for the confirmation page
      sessionStorage.setItem('bth_enrollment', JSON.stringify({
        enrollmentId: data.enrollmentId,
        pdfDownloadUrl: data.pdfDownloadUrl,
        firstName: clientInfo.firstName,
        program,
        programLabel: PROGRAM_INFO[program].label,
      }))

      // Redirect to Stripe payment link
      if (data.stripeLink) {
        window.location.href = data.stripeLink
      } else {
        window.location.href = '/enroll/confirmation'
      }
    } catch {
      setSubmitError('A network error occurred. Please try again.')
      setSubmitting(false)
    }
  }

  // When a program is pre-selected, step 1 is payment choice (program selection skipped)
  const stepTitles: Record<Step, string> = hasPreselectedProgram
    ? { 1: 'Choose your payment', 2: 'Your information', 3: 'Review and sign', 4: 'Confirm' }
    : { 1: 'Choose your program', 2: 'Your information', 3: 'Review and sign', 4: 'Confirm' }

  // Test confirmation screen — shown after a successful test submission instead
  // of redirecting to Stripe. Never shown in production.
  if (testConfirm) {
    return (
      <div className="enroll-page">
        <div className="enroll-test-banner" role="alert">
          TEST MODE — No payment processed
        </div>
        <div className="enroll-header">
          <div className="enroll-header-inner">
            <div className="enroll-breadcrumb">
              <a href="/" className="enroll-breadcrumb-home">Beyond the Horizon</a>
              <span className="enroll-breadcrumb-sep">/</span>
              <span>Enroll</span>
            </div>
            <h1 className="enroll-title">Test Submission Complete</h1>
          </div>
        </div>
        <div className="enroll-body">
          <div className="enroll-card enroll-test-confirm-card">
            <div className="enroll-test-confirm-heading">Full flow exercised successfully</div>
            <p className="enroll-test-confirm-sub">
              The enrollment was recorded in the database as a test record. No payment was processed.
              Emails were routed to the admin address only.
            </p>
            <div className="enroll-test-confirm-table">
              <div className="enroll-test-row">
                <span className="enroll-test-label">Program</span>
                <span className="enroll-test-val">{testConfirm.programLabel}</span>
              </div>
              <div className="enroll-test-row">
                <span className="enroll-test-label">Payment option</span>
                <span className="enroll-test-val">{testConfirm.paymentOption}</span>
              </div>
              <div className="enroll-test-row">
                <span className="enroll-test-label">Resolved payment route</span>
                <span className="enroll-test-val enroll-test-stripe">{testConfirm.paymentRouteLabel}</span>
              </div>
              <div className="enroll-test-row">
                <span className="enroll-test-label">Stripe link configured</span>
                <span className="enroll-test-val">{testConfirm.stripeConfigured ? 'Yes' : 'No — missing from program config'}</span>
              </div>
              <div className="enroll-test-row">
                <span className="enroll-test-label">Enrollment ID</span>
                <span className="enroll-test-val">{testConfirm.enrollmentId}</span>
              </div>
              <div className="enroll-test-row">
                <span className="enroll-test-label">DB record status</span>
                <span className="enroll-test-val"><code>test</code> (test_mode = true)</span>
              </div>
              <div className="enroll-test-row">
                <span className="enroll-test-label">Email behavior</span>
                <span className="enroll-test-val">
                  {testConfirm.emailSuppressed
                    ? 'Suppressed — ENROLLMENT_TEST_EMAIL not configured'
                    : `Sent to ${testConfirm.emailRecipient} with [TEST] prefix`}
                </span>
              </div>
            </div>
            {testConfirm.pdfDownloadUrl && (
              <div style={{ marginTop: '24px' }}>
                <a
                  href={testConfirm.pdfDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="enroll-btn-primary"
                  style={{ display: 'inline-block', textDecoration: 'none' }}
                >
                  Download test PDF
                </a>
                <p style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>Link valid for 1 hour</p>
              </div>
            )}
            <div style={{ marginTop: '32px' }}>
              <button
                type="button"
                className="enroll-btn-back"
                onClick={() => { setTestConfirm(null); setStep(1) }}
              >
                Run another test
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="enroll-page">
      {isTestMode && (
        <div className="enroll-test-banner" role="alert">
          TEST MODE — Submissions will not go to Stripe. Records are marked as test-only.
        </div>
      )}
      <div className="enroll-header">
        <div className="enroll-header-inner">
          <div className="enroll-breadcrumb">
            <a href="/" className="enroll-breadcrumb-home">Beyond the Horizon</a>
            <span className="enroll-breadcrumb-sep">/</span>
            <span>Enroll</span>
          </div>
          <h1 className="enroll-title">Enrollment</h1>
        </div>
      </div>

      <div className="enroll-body">
        {/* Progress indicator */}
        <div className="enroll-progress">
          {([1, 2, 3] as Step[]).map((s) => (
            <div
              key={s}
              className={`enroll-progress-step${step >= s ? ' active' : ''}${step > s ? ' done' : ''}`}
            >
              <div className="enroll-progress-dot">
                {step > s ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5L8.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> : s}
              </div>
              <div className="enroll-progress-label">{stepTitles[s]}</div>
            </div>
          ))}
        </div>

        <div className="enroll-card">

          {/* ===== STEP 1: Program selection (generic entry) OR Payment only (pre-selected) ===== */}
          {step === 1 && (
            <div className="enroll-step">
              {hasPreselectedProgram && program ? (
                // Pre-selected: show program as confirmed context, ask only for payment
                <>
                  <div className="enroll-program-confirmed">
                    <div className="enroll-program-confirmed-label">Program</div>
                    <div className="enroll-program-confirmed-name">{PROGRAM_INFO[program].label}</div>
                  </div>
                  <h2 className="enroll-step-heading">Choose your payment option</h2>
                </>
              ) : (
                // Generic entry: show program selection first
                <>
                  <h2 className="enroll-step-heading">Choose your program</h2>
                  <div className="enroll-program-grid">
                    {(['executive-coaching', '8-pillars'] as Program[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`enroll-program-card${program === p ? ' selected' : ''}`}
                        onClick={() => { setProgram(p); setPaymentOption(null) }}
                      >
                        <div className="enroll-program-name">{PROGRAM_INFO[p].label}</div>
                        <p className="enroll-program-desc">{PROGRAM_INFO[p].description}</p>
                        <div className="enroll-program-check" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {program && (
                <div className="enroll-payment-section">
                  {!hasPreselectedProgram && <div className="enroll-field-label">Payment option</div>}
                  <div className="enroll-payment-options">
                    <button
                      type="button"
                      className={`enroll-payment-card${paymentOption === 'full' ? ' selected' : ''}`}
                      onClick={() => setPaymentOption('full')}
                    >
                      <div className="enroll-payment-label">Full payment</div>
                      <div className="enroll-payment-price">{PROGRAM_INFO[program].fullPrice}</div>
                      <div className="enroll-payment-note">{PROGRAM_INFO[program].fullNote}</div>
                    </button>
                    <button
                      type="button"
                      className={`enroll-payment-card${paymentOption === 'installment' ? ' selected' : ''}`}
                      onClick={() => setPaymentOption('installment')}
                    >
                      <div className="enroll-payment-label">Installment plan</div>
                      <div className="enroll-payment-price">{PROGRAM_INFO[program].installmentNote}</div>
                      <div className="enroll-payment-note">{PROGRAM_INFO[program].totalCost} total</div>
                    </button>
                  </div>
                </div>
              )}

              <div className="enroll-actions">
                <button
                  type="button"
                  className="enroll-btn-primary"
                  disabled={!step1Valid}
                  onClick={() => setStep(2)}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ===== STEP 2: Client Info ===== */}
          {step === 2 && (
            <div className="enroll-step">
              <h2 className="enroll-step-heading">Your information</h2>
              <p className="enroll-step-sub">This information will appear on your signed agreement.</p>

              <div className="enroll-form-grid">
                <div className="enroll-field">
                  <label className="enroll-label" htmlFor="firstName">First name <span aria-hidden="true">*</span></label>
                  <input
                    id="firstName"
                    className="enroll-input"
                    type="text"
                    value={clientInfo.firstName}
                    onChange={e => setClientInfo(c => ({ ...c, firstName: e.target.value }))}
                    autoComplete="given-name"
                  />
                </div>
                <div className="enroll-field">
                  <label className="enroll-label" htmlFor="lastName">Last name <span aria-hidden="true">*</span></label>
                  <input
                    id="lastName"
                    className="enroll-input"
                    type="text"
                    value={clientInfo.lastName}
                    onChange={e => setClientInfo(c => ({ ...c, lastName: e.target.value }))}
                    autoComplete="family-name"
                  />
                </div>
                <div className="enroll-field enroll-field-full">
                  <label className="enroll-label" htmlFor="email">Email address <span aria-hidden="true">*</span></label>
                  <input
                    id="email"
                    className="enroll-input"
                    type="email"
                    value={clientInfo.email}
                    onChange={e => setClientInfo(c => ({ ...c, email: e.target.value }))}
                    autoComplete="email"
                  />
                </div>
                <div className="enroll-field">
                  <label className="enroll-label" htmlFor="phone">Phone <span className="enroll-label-opt">(optional)</span></label>
                  <input
                    id="phone"
                    className="enroll-input"
                    type="tel"
                    value={clientInfo.phone}
                    onChange={e => setClientInfo(c => ({ ...c, phone: e.target.value }))}
                    autoComplete="tel"
                  />
                </div>
                <div className="enroll-field">
                  <label className="enroll-label" htmlFor="organization">Organization <span className="enroll-label-opt">(optional)</span></label>
                  <input
                    id="organization"
                    className="enroll-input"
                    type="text"
                    value={clientInfo.organization}
                    onChange={e => setClientInfo(c => ({ ...c, organization: e.target.value }))}
                    autoComplete="organization"
                  />
                </div>
                <div className="enroll-field enroll-field-full">
                  <label className="enroll-label" htmlFor="role">Role / title <span className="enroll-label-opt">(optional)</span></label>
                  <input
                    id="role"
                    className="enroll-input"
                    type="text"
                    value={clientInfo.role}
                    onChange={e => setClientInfo(c => ({ ...c, role: e.target.value }))}
                    autoComplete="organization-title"
                  />
                </div>
              </div>

              <div className="enroll-actions">
                <button type="button" className="enroll-btn-back" onClick={() => setStep(1)}>Back</button>
                <button
                  type="button"
                  className="enroll-btn-primary"
                  disabled={!step2Valid}
                  onClick={() => setStep(3)}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ===== STEP 3: Agreement + Signature ===== */}
          {step === 3 && program && paymentOption && (
            <div className="enroll-step">
              <h2 className="enroll-step-heading">Review and sign</h2>

              {/* Enrollment summary at top of step 3 */}
              <div className="enroll-step3-summary">
                <div className="enroll-step3-summary-row">
                  <span className="enroll-step3-summary-key">Program</span>
                  <span className="enroll-step3-summary-val">{PROGRAM_INFO[program].label}</span>
                </div>
                <div className="enroll-step3-summary-row">
                  <span className="enroll-step3-summary-key">Total investment</span>
                  <span className="enroll-step3-summary-val">{PROGRAM_INFO[program].totalCost}</span>
                </div>
                <div className="enroll-step3-summary-row">
                  <span className="enroll-step3-summary-key">Payment</span>
                  <span className="enroll-step3-summary-val">
                    {paymentOption === 'full'
                      ? `${PROGRAM_INFO[program].fullPrice} paid in full`
                      : PROGRAM_INFO[program].installmentNote}
                  </span>
                </div>
                <div className="enroll-step3-summary-row">
                  <span className="enroll-step3-summary-key">Client</span>
                  <span className="enroll-step3-summary-val">{clientInfo.firstName} {clientInfo.lastName}</span>
                </div>
              </div>

              <p className="enroll-step-sub">
                Read the Coaching Services Agreement in full before signing. Agreement version {AGREEMENT_VERSION}.
              </p>

              {/* Dev-only warning — remove once real agreement text is in place */}
              {AGREEMENT_IS_PLACEHOLDER && (
                <div className="enroll-agreement-warning" role="alert">
                  Agreement text is a placeholder. This enrollment flow must not go live until John supplies the verbatim agreement text and <code>AGREEMENT_IS_PLACEHOLDER</code> is set to <code>false</code> in <code>lib/agreement.ts</code>.
                </div>
              )}

              {/* Agreement text */}
              <div className="enroll-agreement-scroll" aria-label="Coaching Services Agreement text" role="region" tabIndex={0}>
                {AGREEMENT_PARAGRAPHS.map((para, i) => {
                  const isHeading = para === para.toUpperCase() && para.length < 100
                  return isHeading
                    ? <p key={i} className="enroll-agreement-heading">{para}</p>
                    : <p key={i} className="enroll-agreement-para">{para}</p>
                })}
              </div>

              {/* Acknowledgements */}
              <div className="enroll-acks">
                <label className="enroll-ack">
                  <input
                    type="checkbox"
                    checked={ack1}
                    onChange={e => setAck1(e.target.checked)}
                    className="enroll-checkbox"
                  />
                  <span>I have read and understand the full Coaching Services Agreement above.</span>
                </label>
                <label className="enroll-ack">
                  <input
                    type="checkbox"
                    checked={ack2}
                    onChange={e => setAck2(e.target.checked)}
                    className="enroll-checkbox"
                  />
                  <span>I agree to be bound by the terms of this agreement.</span>
                </label>
                <label className="enroll-ack">
                  <input
                    type="checkbox"
                    checked={ack3}
                    onChange={e => setAck3(e.target.checked)}
                    className="enroll-checkbox"
                  />
                  <span>I understand that my electronic signature has the same legal effect as a handwritten signature.</span>
                </label>
              </div>

              {/* Signature */}
              <div className="enroll-signature-section">
                <div className="enroll-field-label">Your signature</div>
                <div className="enroll-sig-tabs" role="tablist">
                  <button
                    role="tab"
                    aria-selected={signatureType === 'drawn'}
                    className={`enroll-sig-tab${signatureType === 'drawn' ? ' active' : ''}`}
                    onClick={() => { setSignatureType('drawn'); setHasDrawn(false) }}
                    type="button"
                  >
                    Draw
                  </button>
                  <button
                    role="tab"
                    aria-selected={signatureType === 'typed'}
                    className={`enroll-sig-tab${signatureType === 'typed' ? ' active' : ''}`}
                    onClick={() => setSignatureType('typed')}
                    type="button"
                  >
                    Type
                  </button>
                </div>

                {signatureType === 'drawn' && (
                  <div className="enroll-canvas-wrap">
                    <canvas
                      ref={canvasRef}
                      className="enroll-canvas"
                      width={560}
                      height={140}
                      onMouseDown={startDraw}
                      onMouseMove={draw}
                      onMouseUp={stopDraw}
                      onMouseLeave={stopDraw}
                      onTouchStart={e => { e.preventDefault(); startDraw(e) }}
                      onTouchMove={e => { e.preventDefault(); draw(e) }}
                      onTouchEnd={stopDraw}
                      aria-label="Signature drawing area"
                    />
                    <div className="enroll-canvas-hint">Draw your signature above</div>
                    {hasDrawn && (
                      <button type="button" className="enroll-clear-sig" onClick={clearSignature}>
                        Clear and redraw
                      </button>
                    )}
                  </div>
                )}

                {signatureType === 'typed' && (
                  <div className="enroll-typed-wrap">
                    <input
                      type="text"
                      className="enroll-typed-sig"
                      placeholder="Type your full legal name"
                      value={typedSignature}
                      onChange={e => setTypedSignature(e.target.value)}
                      aria-label="Typed signature"
                    />
                    <div className="enroll-canvas-hint">Type your full legal name as it appears on your ID</div>
                  </div>
                )}
              </div>

              <div className="enroll-actions">
                <button type="button" className="enroll-btn-back" onClick={() => setStep(2)}>Back</button>
                <button
                  type="button"
                  className="enroll-btn-primary"
                  disabled={!step3Valid || submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? 'Submitting…' : 'Sign and proceed to payment'}
                </button>
              </div>

              {submitError && (
                <div className="enroll-error" role="alert">{submitError}</div>
              )}
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        {program && step <= 3 && (
          <div className="enroll-summary">
            <div className="enroll-summary-label">Your selection</div>
            <div className="enroll-summary-program">{PROGRAM_INFO[program].label}</div>
            {paymentOption && (
              <>
                <div className="enroll-summary-price">
                  {PROGRAM_INFO[program].totalCost}
                </div>
                {paymentOption === 'full' ? (
                  <div className="enroll-summary-payment-type">Paid in full</div>
                ) : (
                  <>
                    <div className="enroll-summary-payment-type">Installment plan</div>
                    <div className="enroll-summary-installment">
                      {PROGRAM_INFO[program].installmentCount} monthly payments of {PROGRAM_INFO[program].installmentAmount}
                    </div>
                  </>
                )}
              </>
            )}
            {clientInfo.firstName && (
              <div className="enroll-summary-name">{clientInfo.firstName} {clientInfo.lastName}</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function EnrollPage() {
  return (
    <Suspense fallback={<div className="enroll-loading">Loading…</div>}>
      <EnrollInner />
    </Suspense>
  )
}
