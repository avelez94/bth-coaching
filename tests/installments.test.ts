// ============================================================
// Fixed length installment plans: 6 payments for Executive Coaching,
// 10 for the 8 Pillars, then Stripe stops billing on its own.
// Runs against a local fake of the Stripe API (tests/helpers/fake-stripe)
// and an in-memory database: no real Stripe call, no real payment.
// Run: npm run test:installments
// ============================================================
import { test, mock, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { createHmac, randomUUID } from 'node:crypto'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'
import { NextRequest } from 'next/server'
import { FakeStripe } from './helpers/fake-stripe'
import { fakeDb, tables, type Row } from './helpers/fake-db'
import { addMonthsUTC, ensureFixedInstallmentPlan, fixedPhaseParams, NeedsReview } from '../lib/installment-plan'
import { createStripeClient, formEncode, STRIPE_API_VERSION } from '../lib/stripe-api'

const require = createRequire(__filename)
const root = path.resolve(__dirname, '..')
const url = (p: string) => pathToFileURL(path.join(root, p)).href

const START = Math.floor(Date.UTC(2026, 10, 17, 15, 30, 0) / 1000) // Nov 17 2026 10:30 ET
let stripe: FakeStripe
beforeEach(() => { stripe = new FakeStripe() })
const client = () => createStripeClient('rk_test_local_only', stripe.fetch as typeof fetch)

// ---------- the Stripe side ----------
for (const [program, payments] of [['Executive Coaching', 6], ['8 Pillars', 10]] as const) {
  test(`${program}: ends after exactly ${payments} monthly payments, settings preserved`, async () => {
    stripe.addSubscription({ id: 'sub_A', start: START })
    const r = await ensureFixedInstallmentPlan(client(), { subscriptionId: 'sub_A', payments, amountCents: 60000, enrollmentId: 'enr_1' })
    const sub = stripe.subs.get('sub_A')!
    const sched = stripe.schedules.get(r.scheduleId)!

    // One schedule, cancel at the end, one phase of exactly N monthly periods
    assert.equal(stripe.schedules.size, 1)
    assert.equal(sched.end_behavior, 'cancel')
    const phases = sched.phases as Row[]
    assert.equal(phases.length, 1)
    assert.equal(phases[0].start_date, START)
    assert.equal(phases[0].end_date, addMonthsUTC(START, payments))
    assert.equal(sub.cancel_at, addMonthsUTC(START, payments))
    assert.equal(stripe.paymentsBeforeEnd('sub_A'), payments, `exactly ${payments} charges, no payment ${payments + 1}`)
    assert.equal(r.endsAt, addMonthsUTC(START, payments))

    // Nothing else about the subscription changed
    assert.deepEqual(sub.discounts, ['di_sub_A'], 'ALANTETEST discount still attached')
    assert.equal((sub.automatic_tax as Row).enabled, true, 'automatic tax unchanged')
    assert.equal(sub.default_payment_method, 'pm_sub_A')
    assert.equal(sub.customer, 'cus_sub_A')
    assert.equal(sub.billing_cycle_anchor, START)
    assert.deepEqual(sub.metadata, { from: 'payment_link' })
    const item = (sub.items as { data: Row[] }).data[0]
    assert.equal(item.quantity, 1)
    assert.equal((item.price as Row).unit_amount, 60000)

    // How it was asked: Stripe's documented calls, pinned version, idempotent create, no "iterations"
    const posts = stripe.posts()
    assert.equal(posts.length, 2)
    assert.deepEqual(posts[0].body, { from_subscription: 'sub_A' })
    assert.equal(posts[0].idempotencyKey, 'bth-fixed-plan-sub_A')
    const phase = (posts[1].body.phases as Row[])[0]
    assert.deepEqual(phase.duration, { interval: 'month', interval_count: String(payments) })
    assert.ok(!('iterations' in phase) && !('end_date' in phase))
    assert.deepEqual(phase.discounts, [{ discount: 'di_sub_A' }])
    assert.equal(posts[1].body.proration_behavior, 'none')
    assert.deepEqual(posts[1].body.metadata, { bth_plan: 'fixed_installments', bth_payments: String(payments), bth_enrollment_id: 'enr_1' })
    assert.ok(stripe.requests.every(q => q.version === STRIPE_API_VERSION && q.auth === 'Bearer rk_test_local_only'))
  })
}

test('a plan without a promo code or tax stays that way', async () => {
  stripe.addSubscription({ id: 'sub_B', start: START, promo: false, tax: false })
  await ensureFixedInstallmentPlan(client(), { subscriptionId: 'sub_B', payments: 10, amountCents: 60000, enrollmentId: 'e' })
  const sub = stripe.subs.get('sub_B')!
  assert.deepEqual(sub.discounts, [])
  assert.equal((sub.automatic_tax as Row).enabled, false)
  assert.equal(stripe.paymentsBeforeEnd('sub_B'), 10)
})

test('month end start dates still give exactly 6 payments', async () => {
  for (const d of [Date.UTC(2026, 7, 31, 12), Date.UTC(2027, 0, 31, 23, 59), Date.UTC(2027, 1, 28, 5), Date.UTC(2028, 1, 29, 5)]) {
    stripe = new FakeStripe()
    stripe.addSubscription({ id: 'sub_M', start: d / 1000 })
    await ensureFixedInstallmentPlan(client(), { subscriptionId: 'sub_M', payments: 6, amountCents: 60000, enrollmentId: 'e' })
    assert.equal(stripe.paymentsBeforeEnd('sub_M'), 6, new Date(d).toISOString())
  }
  assert.equal(new Date(addMonthsUTC(Date.UTC(2026, 7, 31) / 1000, 6) * 1000).toISOString().slice(0, 10), '2027-02-28')
})

test('repeated runs change nothing: no second schedule, end date not reset', async () => {
  stripe.addSubscription({ id: 'sub_C', start: START })
  const a = await ensureFixedInstallmentPlan(client(), { subscriptionId: 'sub_C', payments: 6, amountCents: 60000, enrollmentId: 'e' })
  const postsAfterFirst = stripe.posts().length
  const b = await ensureFixedInstallmentPlan(client(), { subscriptionId: 'sub_C', payments: 6, amountCents: 60000, enrollmentId: 'e' })
  assert.equal(b.changed, false)
  assert.equal(b.scheduleId, a.scheduleId)
  assert.equal(stripe.posts().length, postsAfterFirst, 'only reads on the repeat')
  assert.equal(stripe.schedules.size, 1)
})

test('two deliveries at the same moment still make one schedule', async () => {
  stripe.addSubscription({ id: 'sub_D', start: START })
  const run = () => ensureFixedInstallmentPlan(client(), { subscriptionId: 'sub_D', payments: 6, amountCents: 60000, enrollmentId: 'e' })
  const rs = await Promise.allSettled([run(), run()])
  assert.ok(rs.some(r => r.status === 'fulfilled'))
  assert.equal(stripe.schedules.size, 1)
  assert.equal(stripe.paymentsBeforeEnd('sub_D'), 6)
})

test('a failure between the two steps is finished by the retry', async () => {
  stripe.addSubscription({ id: 'sub_E', start: START })
  stripe.failNextScheduleUpdate = 1
  await assert.rejects(ensureFixedInstallmentPlan(client(), { subscriptionId: 'sub_E', payments: 6, amountCents: 60000, enrollmentId: 'e' }))
  assert.equal(stripe.paymentsBeforeEnd('sub_E'), 'unlimited', 'still open ended: must not be reported as done')
  await ensureFixedInstallmentPlan(client(), { subscriptionId: 'sub_E', payments: 6, amountCents: 60000, enrollmentId: 'e' })
  assert.equal(stripe.schedules.size, 1)
  assert.equal(stripe.paymentsBeforeEnd('sub_E'), 6)
})

test('anything unexpected stops before Stripe is changed', async () => {
  const cases: [string, () => void, RegExp][] = [
    ['wrong price', () => stripe.addSubscription({ id: 'sub_X', start: START, amount: 50000 }), /price/],
    ['yearly', () => stripe.addSubscription({ id: 'sub_X', start: START, interval: 'year' }), /once a month/],
    ['quantity 2', () => { const s = stripe.addSubscription({ id: 'sub_X', start: START }); ((s.items as { data: Row[] }).data[0]).quantity = 2 }, /quantity/],
    ['not active', () => { stripe.addSubscription({ id: 'sub_X', start: START }).status = 'incomplete' }, /incomplete/],
    ['already ending', () => { stripe.addSubscription({ id: 'sub_X', start: START }).cancel_at = START + 999 }, /end date/],
    ['someone else\'s schedule', () => {
      stripe.addSubscription({ id: 'sub_X', start: START }).schedule = 'sub_sched_other'
      stripe.schedules.set('sub_sched_other', { id: 'sub_sched_other', status: 'active', end_behavior: 'cancel', subscription: 'sub_X', phases: [{ start_date: START, end_date: START + 1 }, { start_date: START + 1, end_date: START + 2 }] })
    }, /different schedule/],
  ]
  for (const [name, setup, msg] of cases) {
    stripe = new FakeStripe(); setup()
    await assert.rejects(ensureFixedInstallmentPlan(client(), { subscriptionId: 'sub_X', payments: 6, amountCents: 60000, enrollmentId: 'e' }),
      (e: unknown) => e instanceof NeedsReview && msg.test((e as Error).message), name)
    assert.equal(stripe.posts().length, 0, `${name}: no change made`)
  }
})

test('a phase setting this code does not know is never silently dropped', async () => {
  stripe.addSubscription({ id: 'sub_F', start: START })
  stripe.extraPhaseField = { pause_collection: { behavior: 'void' } }
  await assert.rejects(ensureFixedInstallmentPlan(client(), { subscriptionId: 'sub_F', payments: 6, amountCents: 60000, enrollmentId: 'e' }), /pause_collection/)
  assert.equal(stripe.posts().filter(p => p.path.startsWith('/v1/subscription_schedules/')).length, 0, 'schedule not updated')
  // and empty unknown fields are fine
  assert.doesNotThrow(() => fixedPhaseParams({ start_date: 1, end_date: 2, items: [{ price: 'p', quantity: 1 }], some_new_field: null, other: [] }, 6))
  assert.throws(() => fixedPhaseParams({ start_date: 1, end_date: 2, items: [{ price: 'p' }], trial_end: 5 }, 6), /trial/)
  assert.throws(() => fixedPhaseParams({ start_date: 1, end_date: 2, items: [{ price: 'p' }], add_invoice_items: [{ price: 'x' }] }, 6), /one time/)
})

test('a plan no longer in its first month is not counted from the wrong place', async () => {
  const s = stripe.addSubscription({ id: 'sub_G', start: START })
  const item = (s.items as { data: Row[] }).data[0]
  item.current_period_start = addMonthsUTC(START, 1); item.current_period_end = addMonthsUTC(START, 2)
  await assert.rejects(ensureFixedInstallmentPlan(client(), { subscriptionId: 'sub_G', payments: 6, amountCents: 60000, enrollmentId: 'e' }), /first month/)
  assert.equal(stripe.subs.get('sub_G')!.cancel_at, null)
})

test('form encoding matches Stripe nesting', () => {
  assert.equal(decodeURIComponent(formEncode({ a: 'x', phases: [{ items: [{ price: 'p', quantity: 1 }], duration: { interval: 'month', interval_count: 6 } }] })),
    'a=x&phases[0][items][0][price]=p&phases[0][items][0][quantity]=1&phases[0][duration][interval]=month&phases[0][duration][interval_count]=6')
})

// ---------- through the real webhook route ----------
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_local_test_only'
process.env.RESEND_API_KEY = 're_local_test_only'
process.env.RESEND_FROM_EMAIL = 'Beyond the Horizon <test@example.test>'
process.env.ENROLLMENT_TEST_EMAIL = 'test-inbox@example.test'
delete process.env.VERCEL_ENV

let webhook: typeof import('../app/api/stripe/webhook/route')
test.before(async () => {
  mock.module(pathToFileURL(require.resolve('resend')).href, {
    namedExports: { Resend: class { emails = { send: async () => ({ data: { id: 're_x' }, error: null }) } } },
  })
  const { PAGE_DEFAULTS } = await import('../lib/site-content')
  const { DEFAULT_SETTINGS } = await import('../lib/site-settings')
  mock.module(url('lib/site-data.ts'), {
    namedExports: { db: () => fakeDb, getSettings: async () => DEFAULT_SETTINGS, getPageContent: async (p: keyof typeof PAGE_DEFAULTS) => PAGE_DEFAULTS[p] },
  })
  mock.module(url('lib/enrollment-emails.ts'), {
    namedExports: { ENROLLMENT_EMAIL_COLUMNS: '*', sendCompletionEmails: async () => {} },
  })
  webhook = await import('../app/api/stripe/webhook/route')
})

function event(id: string, object: Row, type = 'checkout.session.completed') {
  const body = JSON.stringify({ id, type, livemode: false, data: { object } })
  const t = Math.floor(Date.now() / 1000)
  const sig = createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET!).update(`${t}.${body}`).digest('hex')
  return new NextRequest('http://localhost:3400/api/stripe/webhook', { method: 'POST', body, headers: { 'stripe-signature': `t=${t},v1=${sig}` } })
}
function enrollment(o: { option: 'full' | 'installment'; count: number }) {
  const id = randomUUID()
  tables.enrollments.push({ id, status: 'pending_payment', payment_option: o.option, program: o.count === 6 ? 'executive-coaching' : '8-pillars',
    test_mode: false, price_installment_cents: 60000, price_installment_count: o.count, installment_plan_status: null, stripe_subscription_id: null })
  return id
}
const checkout = (sid: string, ref: string, sub: string | null, amount = 0) => ({
  id: sid, client_reference_id: ref, customer_details: { email: 'client@example.test', name: 'Pat Client' },
  amount_total: amount, currency: 'usd', payment_status: 'paid', mode: sub ? 'subscription' : 'payment', livemode: false, subscription: sub,
})

test('webhook: ALANTETEST installment checkout is paid, ends after payment 6, and repeats change nothing', async () => {
  const realFetch = globalThis.fetch
  globalThis.fetch = stripe.fetch as typeof fetch
  process.env.STRIPE_RESTRICTED_KEY = 'rk_test_local_only'
  try {
    stripe.addSubscription({ id: 'sub_W', start: START })
    const ref = enrollment({ option: 'installment', count: 6 })
    const r1 = await webhook.POST(event('evt_1', checkout('cs_W', ref, 'sub_W')))
    assert.equal(r1.status, 200)
    const e = tables.enrollments.find(x => x.id === ref)!
    assert.equal(e.status, 'paid')
    assert.equal(e.installment_plan_status, 'scheduled')
    assert.equal(e.installment_plan_payments, 6)
    assert.equal(e.stripe_subscription_id, 'sub_W')
    assert.equal(e.installment_plan_ends_at, new Date(addMonthsUTC(START, 6) * 1000).toISOString())
    assert.equal(stripe.paymentsBeforeEnd('sub_W'), 6)
    const calls = stripe.requests.length

    // Stripe repeats the event and sends the async one too
    assert.equal((await webhook.POST(event('evt_1', checkout('cs_W', ref, 'sub_W')))).status, 200)
    assert.equal((await webhook.POST(event('evt_2', checkout('cs_W', ref, 'sub_W'), 'checkout.session.async_payment_succeeded'))).status, 200)
    assert.equal(stripe.requests.length, calls, 'no Stripe calls once confirmed')
    assert.equal(stripe.schedules.size, 1)
    assert.equal(tables.stripe_payments.filter(p => p.stripe_session_id === 'cs_W').length, 1, 'one payment record')
  } finally { globalThis.fetch = realFetch; delete process.env.STRIPE_RESTRICTED_KEY }
})

test('webhook: without the key the installment is flagged and Stripe is told to retry; it heals once the key exists', async () => {
  const realFetch = globalThis.fetch
  globalThis.fetch = stripe.fetch as typeof fetch
  try {
    stripe.addSubscription({ id: 'sub_K', start: START })
    const ref = enrollment({ option: 'installment', count: 10 })
    const r = await webhook.POST(event('evt_k1', checkout('cs_K', ref, 'sub_K')))
    assert.equal(r.status, 500)
    const e = tables.enrollments.find(x => x.id === ref)!
    assert.equal(e.status, 'paid', 'the payment itself is still recorded')
    assert.equal(e.installment_plan_status, 'failed')
    assert.match(String(e.installment_plan_error), /STRIPE_RESTRICTED_KEY/)
    assert.equal(stripe.requests.length, 0)

    process.env.STRIPE_RESTRICTED_KEY = 'rk_test_local_only'
    assert.equal((await webhook.POST(event('evt_k1', checkout('cs_K', ref, 'sub_K')))).status, 200)
    assert.equal(e.installment_plan_status, 'scheduled')
    assert.equal(e.installment_plan_error, null)
    assert.equal(stripe.paymentsBeforeEnd('sub_K'), 10)
  } finally { globalThis.fetch = realFetch; delete process.env.STRIPE_RESTRICTED_KEY }
})

test('webhook: a Stripe error is retried, not reported as done', async () => {
  const realFetch = globalThis.fetch
  globalThis.fetch = stripe.fetch as typeof fetch
  process.env.STRIPE_RESTRICTED_KEY = 'rk_test_local_only'
  try {
    stripe.addSubscription({ id: 'sub_R', start: START })
    stripe.failNextScheduleUpdate = 1
    const ref = enrollment({ option: 'installment', count: 6 })
    assert.equal((await webhook.POST(event('evt_r', checkout('cs_R', ref, 'sub_R')))).status, 500)
    assert.equal(tables.enrollments.find(x => x.id === ref)!.installment_plan_status, 'failed')
    assert.equal((await webhook.POST(event('evt_r', checkout('cs_R', ref, 'sub_R')))).status, 200)
    assert.equal(tables.enrollments.find(x => x.id === ref)!.installment_plan_status, 'scheduled')
    assert.equal(stripe.schedules.size, 1)
    assert.equal(stripe.paymentsBeforeEnd('sub_R'), 6)
  } finally { globalThis.fetch = realFetch; delete process.env.STRIPE_RESTRICTED_KEY }
})

test('webhook: pay in full never calls Stripe', async () => {
  const realFetch = globalThis.fetch
  globalThis.fetch = stripe.fetch as typeof fetch
  try {
    const ref = enrollment({ option: 'full', count: 6 })
    assert.equal((await webhook.POST(event('evt_f', checkout('cs_F', ref, null, 360000)))).status, 200)
    const e = tables.enrollments.find(x => x.id === ref)!
    assert.equal(e.status, 'paid')
    assert.equal(e.installment_plan_status, null)
    assert.equal(stripe.requests.length, 0)
  } finally { globalThis.fetch = realFetch }
})
