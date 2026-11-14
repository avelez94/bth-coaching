'use client'

import { useSettingsForm, type SettingField } from './settings-form'
import type { ViewProps } from '../page'

const CONTACT: SettingField[] = [
  { key: 'contactEmail', label: 'Contact email', help: 'Shown in the footer and on the Contact page, and printed on signed agreements.' },
  { key: 'phone', label: 'Phone number', help: 'Shown in the footer and on the Contact page, and printed on signed agreements. Example: 703-705-2225' },
  { key: 'linkedinCompanyUrl', label: 'LinkedIn: Beyond the Horizon page', help: 'The full address of the company page. Leave blank to hide it.' },
  { key: 'linkedinPersonalUrl', label: 'LinkedIn: your personal profile', help: 'The full address of your profile. Leave blank to hide it.' },
]
const FOOTER: SettingField[] = [
  { key: 'businessName', label: 'Business name', help: 'Used in the copyright line at the bottom of every page.' },
  { key: 'footerDescription', label: 'Short description', help: 'The line under the logo in the footer.' },
  { key: 'location', label: 'Location line', help: 'Shown under the description in the footer.' },
  { key: 'footerTagline', label: 'Tagline', help: 'The closing line at the bottom of every page.' },
]

export default function SettingsView(props: ViewProps) {
  const { draft, renderField, saveBar } = useSettingsForm([...CONTACT, ...FOOTER], props)
  return (
    <>
      <div className="main-topbar">
        <div>
          <div className="main-topbar-title">Site Settings</div>
          <div className="main-topbar-sub">Your contact details and the information in the footer of every page.</div>
        </div>
        {saveBar}
      </div>
      <div className="page-wrap">
        <p className="intro-box">Booking links for the &ldquo;Schedule a call&rdquo; buttons are under <strong>Scheduling</strong>. Prices are under <strong>Pricing &amp; Payments</strong>.</p>
        {draft && (
          <div className="grid-2">
            <div className="card">
              <div className="eyebrow">Contact details</div>
              {CONTACT.map(renderField)}
            </div>
            <div className="card">
              <div className="eyebrow">Footer</div>
              {FOOTER.map(renderField)}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
