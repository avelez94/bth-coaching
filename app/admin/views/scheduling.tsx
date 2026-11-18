'use client'

import { useSettingsForm, type SettingField } from './settings-form'
import type { ViewProps } from '../page'

const LINKS: SettingField[] = [
  { key: 'bookingMainUrl', label: 'Main Booking Page', help: 'Your Microsoft Bookings home page, where visitors choose Individual or Organizational. Used by the general "Schedule a Free 15-Minute Call" buttons: the top menu (computer and phone), the footer, the Home page (top and bottom), About, and the bottom of Contact.', placeholder: 'https://bookings.cloud.microsoft/book/...' },
  { key: 'bookingFreeCallUrl', label: 'Individual Consultation: booking link', help: 'Used by the buttons on individual coaching pages: Executive Coaching, 8 Pillars Leadership, the 8 Pillar Sprint, and the individual button beside the organizational one on The 8 Pillars and Contact. Leave blank to keep those buttons turned off.', placeholder: 'https://bookings.cloud.microsoft/book/...' },
  { key: 'bookingOrgConsultUrl', label: 'Organizational Consultation: booking link', help: 'Used by every "Schedule an Organizational Consultation" button: For Organizations (2), Sample Engagements, The 8 Pillars and Contact. Leave blank to keep those buttons turned off.', placeholder: 'https://bookings.cloud.microsoft/book/...' },
]

const BASE_QUESTIONS = [
  'Name',
  'Email',
  'Phone/text number',
  'How would you like to meet? Teams video / phone',
  'Best way to reach you',
  'Have you worked with an executive or professional coach before?',
  'What’s prompting you to reach out now? (optional)',
  'How did you hear about me? (optional)',
]

export default function SchedulingView(props: ViewProps) {
  const { saved, draft, renderField, saveBar } = useSettingsForm(LINKS, props)
  return (
    <>
      <div className="main-topbar">
        <div>
          <div className="main-topbar-title">Scheduling</div>
          <div className="main-topbar-sub">Connect your Microsoft Bookings pages to the &ldquo;Schedule&rdquo; buttons on your website.</div>
        </div>
        {saveBar}
      </div>
      <div className="page-wrap">
        <div className="notice">
          <strong>Microsoft Bookings controls your calendar.</strong> Your available times, buffers, notice period, and intake questions are set inside Microsoft Bookings, not here. This page connects the website buttons to your booking pages and keeps a record of how they are set up.
        </div>

        {draft && (
          <div className="card">
            <div className="eyebrow">Booking links</div>
            {LINKS.map(renderField)}
            <p className="field-hint" style={{ marginTop: 14 }}>
              {saved?.bookingMainUrl
                ? 'The general buttons open your Main Booking Page. Service pages open their own booking page.'
                : saved?.bookingFreeCallUrl
                  ? 'No Main Booking Page is saved yet, so the general buttons use the Individual Consultation link.'
                  : 'The booking buttons are turned off (shown faded) until a link is saved.'}
            </p>
          </div>
        )}

        <div className="grid-2">
          <div className="card">
            <div className="card-title">Free 15-Minute Call</div>
            <div className="card-sub">For individual leaders exploring coaching.</div>
            <div className="eyebrow" style={{ marginTop: 10 }}>Availability</div>
            <dl className="kv">
              <dt>Monday to Friday</dt><dd>7 to 8 AM and 4 to 7 PM Eastern</dd>
              <dt>Saturday</dt><dd>7 AM to 6 PM Eastern</dd>
              <dt>Buffer</dt><dd>30 minutes between appointments</dd>
              <dt>Notice</dt><dd>At least 24 hours; no same-day bookings</dd>
            </dl>
            <div className="eyebrow" style={{ marginTop: 18 }}>Intake questions</div>
            <ul className="list-plain">{BASE_QUESTIONS.map(q => <li key={q}>{q}</li>)}</ul>
          </div>
          <div className="card">
            <div className="card-title">30-Minute Organizational Consultation</div>
            <div className="card-sub">For organizations sponsoring a leader or a team.</div>
            <div className="eyebrow" style={{ marginTop: 10 }}>Intake questions</div>
            <p className="field-hint">The same questions as the free call, plus:</p>
            <ul className="list-plain">
              <li>Organization and your role</li>
              <li>Is this for yourself, one leader, or a team?</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="eyebrow">Booking description and confirmation message</div>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.8)' }}>
            On this call, I’d like to learn about you and your background, what’s bringing you to coaching now, and what you hope to get out of it. I’ll share my background and coaching style so you can get a sense of fit.
          </p>
          <p className="field-hint" style={{ marginTop: 10 }}>To change this wording, edit the service description in Microsoft Bookings.</p>
        </div>
      </div>
    </>
  )
}
