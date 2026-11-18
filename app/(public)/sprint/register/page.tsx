import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import '../redeem/redeem.css'
import RegisterForm from './register-form'
import { getPageContent, getSettings, getSprintPricing, isPageActive } from '@/lib/site-data'
import { OPTIONAL_PAGES } from '@/lib/optional-pages'
import { formatEasternDate, sprintRegistrationClosed, usd } from '@/lib/program-info'
import { sprintTermsFor } from '@/lib/sprint-terms'

// ============================================================
// /sprint/register: someone joining the 8 Pillar Sprint themselves
// gives their details and accepts the Sprint participant terms, then
// continues to Stripe to pay. Closed after the registration deadline
// (Admin > Pricing). Never indexed.
// ============================================================

export const metadata: Metadata = {
  title: 'Register for the 8 Pillar Sprint',
  robots: { index: false, follow: false },
}

export default async function SprintRegister() {
  if (!(await isPageActive('sprint'))) redirect(OPTIONAL_PAGES.sprint.hiddenRedirect)
  const [c, settings, sprint] = await Promise.all([getPageContent('sprint'), getSettings(), getSprintPricing()])

  return (
    <>
      <section className="rd-hero">
        <div className="rd-inner rd-narrow">
          <p className="rd-label">8 Pillar Sprint</p>
          <h1 className="rd-h1">Register for the Sprint</h1>
        </div>
      </section>

      <section className="rd-body">
        <div className="rd-inner rd-narrow">
          <dl className="rd-details">
            <div><dt>{c['details.dates.label']}</dt><dd>{c['details.dates']}</dd></div>
            <div><dt>{c['details.time.label']}</dt><dd>{c['details.time']}</dd></div>
            <div><dt>{c['details.format.label']}</dt><dd>{c['details.format']}</dd></div>
            <div><dt>Investment</dt><dd>{usd(sprint.priceCents)}</dd></div>
            <div><dt>{c['details.register.label']}</dt><dd>{c['details.register']}</dd></div>
          </dl>
          {sprintRegistrationClosed(sprint.giftRedeemBy) ? (
            <p className="rd-status rd-status-error" role="alert">Registration for the 8 Pillar Sprint closed on {formatEasternDate(sprint.giftRedeemBy)}.</p>
          ) : (
            <>
              <p className="rd-lead">Enter your details below, read the Sprint terms, then continue to Stripe to pay securely. Your email is filled in for you there.</p>
              <RegisterForm terms={sprintTermsFor(sprint.giftRedeemBy)} />
            </>
          )}
          <p className="rd-help">
            Buying the Sprint for someone else? <a href="/sprint#gift">Give the Sprint as a gift</a> instead.
            Questions? Contact John at <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a> or {settings.phone}.
          </p>
        </div>
      </section>
    </>
  )
}
