import type { Metadata } from 'next'
import './redeem.css'
import RedeemForm from './redeem-form'
import { getPageContent, getSettings } from '@/lib/site-data'
import { isToken, normalizeCode, REDEEM_MESSAGE } from '@/lib/sprint-gift-codes'
import { publicGiftState, type PublicGiftState } from '@/lib/sprint-gifts'
import { SPRINT_PARTICIPANT_TERMS } from '@/lib/sprint-terms'

// ============================================================
// /sprint/redeem: where a Sprint gift recipient claims their seat.
// Opened from the certificate link (?token=...) or by typing the code.
// Works whether or not the Sprint page itself is Active, so a gift
// already bought can always be claimed. Never indexed, never cached,
// and the link is not passed on to other sites (no referrer).
// ============================================================

export const metadata: Metadata = {
  title: 'Claim your 8 Pillar Sprint gift',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
}

type Search = Promise<{ token?: string | string[]; code?: string | string[] }>

export default async function Redeem({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams
  const rawToken = typeof sp.token === 'string' ? sp.token : undefined
  const rawCode = typeof sp.code === 'string' ? sp.code : undefined

  let state: (PublicGiftState & { token?: string }) | { state: 'enter' }
  if (rawToken !== undefined) {
    state = isToken(rawToken) ? await safeState({ token: rawToken }) : { state: 'invalid' }
  } else if (rawCode !== undefined) {
    const code = normalizeCode(rawCode)
    state = code ? await safeState({ code }) : { state: 'invalid' }
  } else {
    state = { state: 'enter' }
  }

  const [c, settings] = await Promise.all([getPageContent('sprint'), getSettings()])
  const contact = (
    <p className="rd-help">
      Questions? Contact John at <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a> or {settings.phone}.
    </p>
  )

  return (
    <>
      <section className="rd-hero">
        <div className="rd-inner rd-narrow">
          <p className="rd-label">8 Pillar Sprint</p>
          <h1 className="rd-h1">Claim your Sprint gift</h1>
        </div>
      </section>

      <section className="rd-body">
        <div className="rd-inner rd-narrow">
          {state.state === 'enter' && (
            <>
              <p className="rd-lead">Enter the code from your gift certificate.</p>
              <CodeForm />
              {contact}
            </>
          )}

          {state.state === 'invalid' && (
            <>
              <p className="rd-status rd-status-error" role="alert">{REDEEM_MESSAGE.invalid}</p>
              <p className="rd-lead">Check the link or the code on your certificate and try again.</p>
              <CodeForm />
              {contact}
            </>
          )}

          {(state.state === 'redeemed' || state.state === 'refunded' || state.state === 'cancelled') && (
            <>
              <p className="rd-status rd-status-error" role="alert">{REDEEM_MESSAGE[state.state]}</p>
              {contact}
            </>
          )}

          {state.state === 'valid' && 'token' in state && state.token && (
            <>
              <RedeemForm token={state.token} terms={SPRINT_PARTICIPANT_TERMS}>
                <>
                  <p className="rd-status rd-status-ok">
                    This gift is valid{state.purchaserFirstName ? `, a gift from ${state.purchaserFirstName}` : ''}.
                  </p>
                  <dl className="rd-details">
                    <div><dt>Gift code</dt><dd>{state.code}</dd></div>
                    <div><dt>{c['details.dates.label']}</dt><dd>{c['details.dates']}</dd></div>
                    <div><dt>{c['details.time.label']}</dt><dd>{c['details.time']}</dd></div>
                    <div><dt>{c['details.format.label']}</dt><dd>{c['details.format']}</dd></div>
                    <div><dt>{c['details.register.label']}</dt><dd>{c['details.register']}</dd></div>
                  </dl>
                  <p className="rd-lead">Enter your details to claim your seat and complete your registration.</p>
                </>
              </RedeemForm>
              {contact}
            </>
          )}
        </div>
      </section>
    </>
  )
}

async function safeState(by: { token?: string; code?: string }) {
  try { return await publicGiftState(by) } catch (e) {
    console.error('[gift] lookup failed:', e)
    return { state: 'invalid' as const }
  }
}

function CodeForm() {
  return (
    <form method="get" action="/sprint/redeem" className="rd-code-form">
      <div className="rd-field">
        <label htmlFor="code">Gift code</label>
        <input id="code" name="code" required autoComplete="off" autoCapitalize="characters" spellCheck={false}
          placeholder="SPRINT-XXXX-XXXX-XXXX" />
      </div>
      <button type="submit" className="btn btn-navy">Check code</button>
    </form>
  )
}
