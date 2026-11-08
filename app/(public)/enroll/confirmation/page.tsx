'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import '../enroll.css'
import './confirmation.css'

interface EnrollmentData {
  enrollmentId: string
  pdfDownloadUrl: string | null
  firstName: string
  program: string
  programLabel: string
}

export default function ConfirmationPage() {
  const [data, setData] = useState<EnrollmentData | null>(null)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('bth_enrollment')
      if (stored) {
        setData(JSON.parse(stored))
        sessionStorage.removeItem('bth_enrollment')
      }
    } catch {
      // sessionStorage unavailable
    }
  }, [])

  return (
    <div className="confirm-page">
      <div className="confirm-header">
        <div className="confirm-header-inner">
          <div className="enroll-breadcrumb">
            <a href="/" className="enroll-breadcrumb-home">Beyond the Horizon</a>
            <span className="enroll-breadcrumb-sep">/</span>
            <a href="/enroll" className="enroll-breadcrumb-home">Enroll</a>
            <span className="enroll-breadcrumb-sep">/</span>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      <div className="confirm-body">
        <div className="confirm-card">
          {/* Check icon */}
          <div className="confirm-icon" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="var(--navy)" />
              <path d="M11 20.5l6 6 12-13" stroke="var(--ivory)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="confirm-heading">
            {data?.firstName ? `Thank you, ${data.firstName}.` : 'Thank you.'}
          </h1>

          <p className="confirm-subhead">
            Your agreement has been signed and recorded.
            {data?.programLabel && ` Your enrollment in the ${data.programLabel} is pending payment confirmation.`}
          </p>

          <div className="confirm-what-next">
            <div className="confirm-section-label">What happens next</div>
            <ol className="confirm-steps">
              <li className="confirm-step-item">
                <div className="confirm-step-num">1</div>
                <div>
                  <strong>Check your inbox.</strong> A confirmation email with your agreement details has been sent to the email address you provided.
                </div>
              </li>
              <li className="confirm-step-item">
                <div className="confirm-step-num">2</div>
                <div>
                  <strong>Complete your payment.</strong> If you were not redirected to payment automatically, use the link in your confirmation email or contact John directly.
                </div>
              </li>
              <li className="confirm-step-item">
                <div className="confirm-step-num">3</div>
                <div>
                  <strong>John will reach out.</strong> Once payment is received, John will contact you to schedule your first session.
                </div>
              </li>
            </ol>
          </div>

          {data?.pdfDownloadUrl && (
            <div className="confirm-pdf">
              <a
                href={data.pdfDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="confirm-pdf-link"
              >
                Download your signed agreement (PDF)
              </a>
              <p className="confirm-pdf-note">This link is valid for one hour. John also has a copy on file.</p>
            </div>
          )}

          {data?.enrollmentId && (
            <div className="confirm-ref">
              Reference: <span>{data.enrollmentId}</span>
            </div>
          )}

          <div className="confirm-links">
            <Link href="/" className="confirm-home-link">Return to home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
