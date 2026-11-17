import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { verifyStripeSignature } from '../lib/stripe-webhook'
import { withReference, sprintPublic, DEFAULT_SPRINT_PRICING, sprintSelfReference, sprintRegistrationId, endOfDayEastern, easternDate, formatEasternDate, giftRedemptionClosed } from '../lib/program-info'
import { PAGE_SCHEMA, PAGE_DEFAULTS, faqProgramFor } from '../lib/site-content'
import { OPTIONAL_PAGES, OPTIONAL_PAGE_KEYS } from '../lib/optional-pages'
import { enrollmentClientEmail, contactAdminEmail, esc } from '../lib/email-templates'

const SECRET = 'whsec_test_secret'
const sign = (body: string, t: number, secret = SECRET) => `t=${t},v1=${createHmac('sha256', secret).update(`${t}.${body}`).digest('hex')}`

test('Stripe signature: valid accepted; tampered, wrong secret, stale or missing rejected', () => {
  const body = JSON.stringify({ id: 'evt_1', type: 'checkout.session.completed' })
  const now = Date.now(); const t = Math.floor(now / 1000)
  assert.ok(verifyStripeSignature(body, sign(body, t), SECRET, 300, now))
  assert.ok(!verifyStripeSignature(body + ' ', sign(body, t), SECRET, 300, now))
  assert.ok(!verifyStripeSignature(body, sign(body, t, 'whsec_other'), SECRET, 300, now))
  assert.ok(!verifyStripeSignature(body, sign(body, t - 3600), SECRET, 300, now))
  assert.ok(!verifyStripeSignature(body, null, SECRET, 300, now))
  assert.ok(!verifyStripeSignature(body, 't=abc,v1=zz', SECRET, 300, now))
})

test('Stripe links carry the reference that the webhook matches on', () => {
  const u = new URL(withReference('https://buy.stripe.com/abc123', '0b8c9b8e-1111-4222-8333-444455556666', 'a+b@example.com'))
  assert.equal(u.searchParams.get('client_reference_id'), '0b8c9b8e-1111-4222-8333-444455556666')
  assert.equal(u.searchParams.get('prefilled_email'), 'a+b@example.com')
  const s = sprintPublic(DEFAULT_SPRINT_PRICING)
  assert.equal(s.price, '$450')
  // Joining yourself starts with the registration page, which sends you to
  // Stripe with your registration as the reference
  assert.equal(s.enrollUrl, '/sprint/register')
  const reg = '0b8c9b8e-1111-4222-8333-444455556666'
  const self = new URL(withReference(DEFAULT_SPRINT_PRICING.stripeEnrollUrl, sprintSelfReference(reg), 'p@example.com'))
  assert.equal(self.searchParams.get('client_reference_id'), `sprint_self_${reg}`)
  assert.equal(sprintRegistrationId(self.searchParams.get('client_reference_id')), reg)
  assert.equal(sprintRegistrationId('sprint_self'), null)
  assert.equal(sprintRegistrationId('sprint_gift'), null)
  assert.equal(new URL(s.giftUrl).searchParams.get('client_reference_id'), 'sprint_gift')
})

test('gift deadline is 11:59 PM Eastern, in both standard and daylight time', () => {
  assert.equal(DEFAULT_SPRINT_PRICING.giftRedeemBy, '2027-01-10T23:59:59-05:00')
  assert.equal(endOfDayEastern('2027-01-10'), '2027-01-10T23:59:59-05:00')
  assert.equal(endOfDayEastern('2027-07-04'), '2027-07-04T23:59:59-04:00')
  assert.equal(endOfDayEastern('2027-02-30'), null)
  assert.equal(easternDate(endOfDayEastern('2027-01-10')!), '2027-01-10')
  assert.equal(formatEasternDate(DEFAULT_SPRINT_PRICING.giftRedeemBy), 'January 10, 2027')
  assert.equal(giftRedemptionClosed(DEFAULT_SPRINT_PRICING.giftRedeemBy, new Date('2027-01-11T04:59:59Z')), false)
  assert.equal(giftRedemptionClosed(DEFAULT_SPRINT_PRICING.giftRedeemBy, new Date('2027-01-11T05:00:00Z')), true)
})

test('optional pages are editable pages with a safe redirect', () => {
  for (const k of OPTIONAL_PAGE_KEYS) {
    assert.ok(k in PAGE_SCHEMA, `${k} has an editor`)
    assert.equal(PAGE_SCHEMA[k].path, OPTIONAL_PAGES[k].path)
    assert.ok(OPTIONAL_PAGES[k].hiddenRedirect.startsWith('/') && OPTIONAL_PAGES[k].hiddenRedirect !== OPTIONAL_PAGES[k].path)
  }
})

test('FAQ program answers get their price from Pricing & Payments, never typed in', () => {
  assert.equal(faqProgramFor('programs.1.a'), '8-pillars')
  assert.equal(faqProgramFor('programs.2.a'), 'sprint')
  assert.equal(faqProgramFor('programs.5.a'), 'executive-coaching')
  assert.equal(faqProgramFor('coaching.1.a'), undefined)
  for (const [k, v] of Object.entries(PAGE_DEFAULTS.faq)) assert.ok(!/\$\d/.test(v), `no hardcoded price in ${k}`)
})

test('no dashes used as punctuation in the new pages', () => {
  for (const page of ['sprint', 'faq'] as const) {
    for (const [k, v] of Object.entries(PAGE_DEFAULTS[page])) {
      const visible = v.replace(/\]\([^)]*\)/g, ']')        // link addresses are not shown
      assert.ok(!/[–—]/.test(visible), `${page} ${k} has an en or em dash`)
      assert.ok(!/\s-\s/.test(visible.replace(/^- /gm, '')), `${page} ${k} has a spaced hyphen`)
    }
  }
})

test('emails escape everything a visitor typed', () => {
  assert.equal(esc('<b>"x" & \'y\'</b>'), '&lt;b&gt;&quot;x&quot; &amp; &#39;y&#39;&lt;/b&gt;')
  const evil = '<script>alert(1)</script>'
  const m = contactAdminEmail({ name: evil, email: 'x@y.co', message: evil }, { contactEmail: 'c@d.co', phone: '1' })
  assert.ok(!m.html.includes('<script>'))
  const e = enrollmentClientEmail({
    enrollmentId: 'id', firstName: evil, lastName: 'L', email: 'x@y.co', programLabel: 'Executive Coaching',
    paymentLabel: 'Pay in full, $3,600', totalPrice: '$3,600', amountToday: '$3,600', signedAtDisplay: 'today', agreementVersion: '1.0',
  }, { contactEmail: 'c@d.co', phone: '1' })
  assert.ok(!e.html.includes('<script>'))
  assert.ok(e.text.includes('Executive Coaching'))
  assert.ok(!/[–—]/.test(e.subject + e.text))
})
