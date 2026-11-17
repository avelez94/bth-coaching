// ============================================================
// End to end test of the Sprint gift flow through the real route
// handlers: Stripe webhook → gift + certificate email → redemption →
// admin view/copy/resend/cancel → refund. The database is an in-memory
// stand-in with the same unique rules as the real tables, and Resend is
// replaced by a recorder, so nothing leaves this machine: no real
// payment, no real email.
// Run: npm run test:gifts
// ============================================================
import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { createHmac, randomUUID } from 'node:crypto'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'
import { NextRequest } from 'next/server'

const require = createRequire(__filename)

const root = path.resolve(__dirname, '..')
const url = (p: string) => pathToFileURL(path.join(root, p)).href

// ---------- in-memory tables ----------
type Row = Record<string, unknown>
const tables: Record<string, Row[]> = { stripe_payments: [], sprint_gifts: [], email_log: [], enrollments: [] }
const UNIQUE: Record<string, string[]> = {
  stripe_payments: ['stripe_session_id'],
  sprint_gifts: ['stripe_payment_id', 'stripe_session_id', 'token', 'code'],
}
type Filter = (r: Row) => boolean
class Q {
  private op: 'select' | 'insert' | 'update' | 'upsert' = 'select'
  private filters: Filter[] = []
  private payload: Row | Row[] | null = null
  private returning = false
  private one = false
  private conflict = ''
  constructor(private t: string) { tables[t] ??= [] }
  select() { if (this.op !== 'select') this.returning = true; return this }
  insert(p: Row | Row[]) { this.op = 'insert'; this.payload = p; return this }
  update(p: Row) { this.op = 'update'; this.payload = p; return this }
  upsert(p: Row, o: { onConflict: string }) { this.op = 'upsert'; this.payload = p; this.conflict = o.onConflict; return this }
  eq(c: string, v: unknown) { this.filters.push(r => r[c] === v); return this }
  is(c: string, v: unknown) { this.filters.push(r => (r[c] ?? null) === v); return this }
  in(c: string, v: unknown[]) { this.filters.push(r => v.includes(r[c])); return this }
  order() { return this }
  maybeSingle() { this.one = true; return this }
  single() { this.one = true; return this }
  private dup(row: Row, except?: Row) {
    return (UNIQUE[this.t] ?? []).some(k => row[k] != null && tables[this.t].some(o => o !== except && o[k] === row[k]))
  }
  private run(): { data: unknown; error: { code: string; message: string } | null } {
    const rows = tables[this.t]
    const match = () => rows.filter(r => this.filters.every(f => f(r)))
    const out = (rs: Row[]) => ({ data: this.one ? (rs[0] ? { ...rs[0] } : null) : rs.map(r => ({ ...r })), error: null })
    if (this.op === 'select') return out(match())
    if (this.op === 'insert') {
      const list = Array.isArray(this.payload) ? this.payload : [this.payload!]
      const made: Row[] = []
      for (const p of list) {
        const row: Row = { id: randomUUID(), created_at: new Date().toISOString(), status: this.t === 'sprint_gifts' ? 'purchased' : this.t === 'sprint_registrations' ? 'pending_payment' : undefined, ...p }
        if (this.dup(row)) return { data: null, error: { code: '23505', message: 'duplicate key' } }
        rows.push(row); made.push(row)
      }
      return this.returning ? out(made) : { data: null, error: null }
    }
    if (this.op === 'update') {
      const hit = match()
      for (const r of hit) {
        const next = { ...r, ...(this.payload as Row) }
        if (this.dup(next, r)) return { data: null, error: { code: '23505', message: 'duplicate key' } }
        if (this.t === 'sprint_gifts' && next.status === 'redeemed' && (!next.redeemed_at || !next.recipient_email)) return { data: null, error: { code: '23514', message: 'check' } }
        Object.assign(r, this.payload)
      }
      return this.returning ? out(hit) : { data: null, error: null }
    }
    // upsert
    const p = this.payload as Row
    const existing = rows.find(r => r[this.conflict] === p[this.conflict])
    if (existing) Object.assign(existing, p)
    else rows.push({ id: randomUUID(), created_at: new Date().toISOString(), ...p })
    const row = existing ?? rows[rows.length - 1]
    return this.returning ? out([row]) : { data: null, error: null }
  }
  then<T>(res: (v: ReturnType<Q['run']>) => T, rej?: (e: unknown) => T) { try { return Promise.resolve(res(this.run())) } catch (e) { return rej ? Promise.resolve(rej(e)) : Promise.reject(e) } }
}
const fakeDb = { from: (t: string) => new Q(t) }

// The gift redemption deadline the stand-in database reports (tests can move it)
let sprintRedeemBy = '2027-01-10T23:59:59-05:00'

// ---------- email recorder ----------
const sent: { from: string; to: string; subject: string; text: string; html: string; attachments?: { filename: string; content: Buffer }[] }[] = []

process.env.STRIPE_WEBHOOK_SECRET = 'whsec_local_test_only'
process.env.RESEND_API_KEY = 're_local_test_only'
process.env.RESEND_FROM_EMAIL = 'Beyond the Horizon <test@example.test>'
process.env.ENROLLMENT_TEST_EMAIL = 'test-inbox@example.test'
delete process.env.VERCEL_ENV // not production: every gift email must go to the test inbox

let routes: {
  webhook: typeof import('../app/api/stripe/webhook/route')
  redeem: typeof import('../app/api/sprint/redeem/route')
  admin: typeof import('../app/api/admin/sprint-gifts/route')
  gifts: typeof import('../lib/sprint-gifts')
}

test.before(async () => {
  mock.module(pathToFileURL(require.resolve('resend')).href, {
    namedExports: {
      Resend: class { emails = { send: async (m: (typeof sent)[number]) => { sent.push(m); return { data: { id: `re_${sent.length}` }, error: null } } } },
    },
  })
  const { PAGE_DEFAULTS } = await import('../lib/site-content')
  const { DEFAULT_SETTINGS } = await import('../lib/site-settings')
  const { DEFAULT_SPRINT_PRICING } = await import('../lib/program-info')
  mock.module(url('lib/site-data.ts'), {
    namedExports: {
      db: () => fakeDb,
      getSettings: async () => DEFAULT_SETTINGS,
      getPageContent: async (p: keyof typeof PAGE_DEFAULTS) => PAGE_DEFAULTS[p],
      getSprintPricing: async () => ({ ...DEFAULT_SPRINT_PRICING, giftRedeemBy: sprintRedeemBy }),
      isPageActive: async () => true,
    },
  })
  mock.module(url('lib/admin-auth.ts'), { namedExports: { verifyAdminToken: (req: Request) => req.headers.get('x-test-admin') === 'yes' } })
  routes = {
    webhook: await import('../app/api/stripe/webhook/route'),
    redeem: await import('../app/api/sprint/redeem/route'),
    admin: await import('../app/api/admin/sprint-gifts/route'),
    gifts: await import('../lib/sprint-gifts'),
  }
})

// ---------- helpers ----------
function stripeEvent(id: string, type: string, object: Row) {
  const body = JSON.stringify({ id, type, livemode: false, data: { object } })
  const t = Math.floor(Date.now() / 1000)
  const sig = createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET!).update(`${t}.${body}`).digest('hex')
  return new NextRequest('http://localhost:3400/api/stripe/webhook', { method: 'POST', body, headers: { 'stripe-signature': `t=${t},v1=${sig}` } })
}
const session = (id: string, ref: string, pi: string) => ({
  id, client_reference_id: ref, customer_details: { email: 'buyer@example.test', name: 'Pat Buyer' },
  amount_total: 45000, currency: 'usd', payment_status: 'paid', mode: 'payment', livemode: false, payment_intent: pi,
})
const post = (u: string, body: unknown, admin = false) => new NextRequest(`http://localhost:3400${u}`, {
  method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json', ...(admin ? { 'x-test-admin': 'yes' } : {}) },
})
const get = (u: string, admin = false) => new NextRequest(`http://localhost:3400${u}`, { headers: admin ? { 'x-test-admin': 'yes' } : {} })
const giftEmails = () => sent.filter(m => m.subject === 'Your 8 Pillar Sprint gift certificate')

// ---------- the flow ----------
test('1-5, 12: paid gift webhook creates one gift, one code, one certificate email (also when repeated)', async () => {
  const r1 = await routes.webhook.POST(stripeEvent('evt_1', 'checkout.session.completed', session('cs_test_A', 'sprint_gift', 'pi_test_A')))
  assert.equal(r1.status, 200)
  assert.equal(tables.sprint_gifts.length, 1)
  const g = tables.sprint_gifts[0]
  assert.match(String(g.code), /^SPRINT-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/)
  assert.equal(String(g.token).length, 43)
  assert.equal(g.purchaser_email, 'buyer@example.test')
  assert.equal(g.amount_cents, 45000)
  assert.ok(g.certificate_sent_at)

  // purchaser email: test inbox only, PDF attached, code and link inside
  assert.equal(giftEmails().length, 1)
  const m = giftEmails()[0]
  assert.equal(m.to, 'test-inbox@example.test')
  assert.ok(m.text.includes(String(g.code)) && m.text.includes(`/sprint/redeem?token=${g.token}`) && m.text.includes('January 10, 2027'))
  assert.ok(m.html.includes('TEST MODE') && m.html.includes('buyer@example.test'))
  assert.equal(m.attachments?.length, 1)
  assert.ok(m.attachments![0].filename.endsWith('.pdf') && m.attachments![0].content.subarray(0, 5).toString() === '%PDF-')
  // John's notice, also to the test inbox
  assert.equal(sent.filter(x => x.subject.startsWith('8 Pillar Sprint gift purchased')).length, 1)
  assert.ok(tables.email_log.some(l => l.kind === 'gift_certificate' && l.gift_id === g.id && l.status === 'sent' && l.test_mode === true))

  // Stripe repeats the same event, and also sends the async success for the same session
  await routes.webhook.POST(stripeEvent('evt_1', 'checkout.session.completed', session('cs_test_A', 'sprint_gift', 'pi_test_A')))
  await routes.webhook.POST(stripeEvent('evt_2', 'checkout.session.async_payment_succeeded', session('cs_test_A', 'sprint_gift', 'pi_test_A')))
  assert.equal(tables.sprint_gifts.length, 1, 'no second gift')
  assert.equal(tables.sprint_gifts[0].code, g.code, 'no second code')
  assert.equal(giftEmails().length, 1, 'no second certificate email')
  assert.equal(tables.stripe_payments.length, 1)
})

test('unpaid checkout and the self purchase link never create a gift', async () => {
  await routes.webhook.POST(stripeEvent('evt_3', 'checkout.session.completed', { ...session('cs_test_U', 'sprint_gift', 'pi_test_U'), payment_status: 'unpaid' }))
  await routes.webhook.POST(stripeEvent('evt_4', 'checkout.session.completed', session('cs_test_S', 'sprint_self', 'pi_test_S')))
  assert.equal(tables.sprint_gifts.length, 1)
  assert.equal(sent.filter(x => x.subject.startsWith('New 8 Pillar Sprint registration')).length, 1, 'self purchase still notifies John as before')
  // unsigned request is refused
  const bad = new NextRequest('http://localhost:3400/api/stripe/webhook', { method: 'POST', body: '{}', headers: { 'stripe-signature': 't=1,v1=00' } })
  assert.equal((await routes.webhook.POST(bad)).status, 400)
})

test('10: invalid token is refused without details', async () => {
  const r = await routes.redeem.POST(post('/api/sprint/redeem', { token: 'x'.repeat(43), name: 'A B', email: 'a@b.test' }))
  assert.equal(r.status, 404)
  const body = await r.json()
  assert.deepEqual(body, { error: 'This gift link is not valid.', state: 'invalid' })
  assert.equal((await routes.redeem.POST(post('/api/sprint/redeem', { token: 'short', name: 'A B', email: 'a@b.test' }))).status, 404)
})

test('6-9: recipient registers once; the second attempt is blocked and reveals nothing', async () => {
  const g = tables.sprint_gifts[0]
  assert.deepEqual(
    await routes.gifts.publicGiftState({ token: String(g.token) }),
    { state: 'valid', code: g.code, purchaserFirstName: 'Pat', redeemBy: 'January 10, 2027', token: g.token },
  )
  const bad = await routes.redeem.POST(post('/api/sprint/redeem', { token: g.token, name: 'R', email: 'nope' }))
  assert.equal(bad.status, 400)
  assert.equal(tables.sprint_gifts[0].status, 'purchased')

  const ok = await routes.redeem.POST(post('/api/sprint/redeem', { token: g.token, name: '  Riley   Recipient ', email: 'Riley@Example.test', phone: '555 0100' }))
  assert.equal(ok.status, 200)
  const after = tables.sprint_gifts[0]
  assert.equal(after.status, 'redeemed')
  assert.ok(after.redeemed_at)
  assert.equal(after.recipient_name, 'Riley Recipient')
  assert.equal(after.recipient_email, 'riley@example.test')
  assert.equal(after.terms_version ?? null, null, 'no terms recorded: none are active')
  assert.ok(sent.some(x => x.subject === 'You are registered for the 8 Pillar Sprint' && x.to === 'test-inbox@example.test'))
  assert.ok(sent.some(x => x.subject === '8 Pillar Sprint gift redeemed: Riley Recipient'))

  const again = await routes.redeem.POST(post('/api/sprint/redeem', { token: g.token, name: 'Someone Else', email: 'else@example.test' }))
  assert.equal(again.status, 409)
  const body = await again.json()
  assert.deepEqual(body, { error: 'This gift has already been redeemed.', state: 'redeemed' })
  assert.equal(tables.sprint_gifts[0].recipient_name, 'Riley Recipient', 'first registration kept')
  assert.deepEqual(await routes.gifts.publicGiftState({ token: String(g.token) }), { state: 'redeemed' })
})

test('11: a refunded gift cannot be redeemed; a partial refund leaves it usable', async () => {
  await routes.webhook.POST(stripeEvent('evt_5', 'checkout.session.completed', session('cs_test_B', 'sprint_gift', 'pi_test_B')))
  const g = tables.sprint_gifts.find(x => x.stripe_session_id === 'cs_test_B')!
  await routes.webhook.POST(stripeEvent('evt_6', 'charge.refunded', { id: 'ch_1', payment_intent: 'pi_test_B', amount: 45000, amount_refunded: 10000, refunded: false, livemode: false }))
  assert.equal(g.status, 'purchased')
  await routes.webhook.POST(stripeEvent('evt_7', 'charge.refunded', { id: 'ch_1', payment_intent: 'pi_test_B', amount: 45000, amount_refunded: 45000, refunded: true, livemode: false }))
  assert.equal(g.status, 'refunded')
  assert.ok(g.refunded_at)
  const r = await routes.redeem.POST(post('/api/sprint/redeem', { token: g.token, name: 'Late Person', email: 'late@example.test' }))
  assert.equal(r.status, 409)
  assert.equal((await r.json()).state, 'refunded')
  // a repeated refund event is harmless
  assert.equal((await routes.webhook.POST(stripeEvent('evt_7', 'charge.refunded', { id: 'ch_1', payment_intent: 'pi_test_B', amount: 45000, amount_refunded: 45000, refunded: true, livemode: false }))).status, 200)
})

test('13: admin can list, copy link, resend, and cancel (internal) without creating a redemption', async () => {
  assert.equal((await routes.admin.GET(get('/api/admin/sprint-gifts'))).status, 401)
  await routes.webhook.POST(stripeEvent('evt_8', 'checkout.session.completed', session('cs_test_C', 'sprint_gift', 'pi_test_C')))
  const list = await (await routes.admin.GET(get('/api/admin/sprint-gifts', true))).json()
  assert.equal(list.gifts.length, 3)
  const c = list.gifts.find((x: { stripe_session_id: string }) => x.stripe_session_id === 'cs_test_C')
  const gc = tables.sprint_gifts.find(x => x.stripe_session_id === 'cs_test_C')!
  assert.equal(c.link, `http://localhost:3400/sprint/redeem?token=${gc.token}`)
  assert.equal(c.status, 'purchased')
  assert.equal(c.token, undefined, 'raw token field not sent, only the link')

  const before = giftEmails().length
  const rs = await routes.admin.POST(post('/api/admin/sprint-gifts', { action: 'resend', id: gc.id }, true))
  assert.equal(rs.status, 200)
  assert.equal(giftEmails().length, before + 1)
  assert.equal(gc.status, 'purchased')

  // resend refused for a redeemed gift; cancel refused for redeemed
  const redeemed = tables.sprint_gifts.find(x => x.status === 'redeemed')!
  assert.equal((await routes.admin.POST(post('/api/admin/sprint-gifts', { action: 'resend', id: redeemed.id }, true))).status, 409)
  assert.equal((await routes.admin.POST(post('/api/admin/sprint-gifts', { action: 'cancel', id: redeemed.id }, true))).status, 409)

  const cn = await routes.admin.POST(post('/api/admin/sprint-gifts', { action: 'cancel', id: gc.id, note: 'Buyer asked to hold' }, true))
  assert.equal(cn.status, 200)
  assert.equal(gc.status, 'cancelled')
  const r = await routes.redeem.POST(post('/api/sprint/redeem', { token: gc.token, name: 'X Y', email: 'x@example.test' }))
  assert.equal((await r.json()).state, 'cancelled')
  assert.equal(tables.sprint_gifts.filter(x => x.status === 'redeemed').length, 1)
})

test('11b: Stripe test events are ignored on the live site', async () => {
  process.env.VERCEL_ENV = 'production'
  try {
    const n = tables.sprint_gifts.length
    await routes.webhook.POST(stripeEvent('evt_9', 'checkout.session.completed', session('cs_test_D', 'sprint_gift', 'pi_test_D')))
    assert.equal(tables.sprint_gifts.length, n)
  } finally { delete process.env.VERCEL_ENV }
})

test('no gift email in this run went anywhere but the test inbox', () => {
  assert.ok(sent.length > 0)
  // (The self purchase notice to John is the existing, unchanged flow and is not a gift email.)
  for (const m of sent.filter(x => !x.subject.startsWith('New 8 Pillar Sprint registration'))) assert.equal(m.to, 'test-inbox@example.test', m.subject)
})

// ---------- gift redemption deadline ----------
test('after the gift deadline an unused gift cannot be redeemed, and stays on record', async () => {
  await routes.webhook.POST(stripeEvent('evt_dl', 'checkout.session.completed', session('cs_test_DL', 'sprint_gift', 'pi_test_DL')))
  const g = tables.sprint_gifts.find(x => x.stripe_session_id === 'cs_test_DL')!
  const saved = sprintRedeemBy
  try {
    sprintRedeemBy = new Date(Date.now() - 60_000).toISOString() // deadline just passed
    assert.deepEqual(await routes.gifts.publicGiftState({ token: String(g.token) }), { state: 'closed', closedOn: new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(sprintRedeemBy)) })
    const r = await routes.redeem.POST(post('/api/sprint/redeem', { token: g.token, name: 'Late Person', email: 'late@example.test' }))
    assert.equal(r.status, 410)
    assert.deepEqual(await r.json(), { error: 'Registration for Sprint gifts has closed, so this gift can no longer be redeemed.', state: 'closed' })
    assert.equal(g.status, 'purchased', 'not deleted or changed')
    assert.equal(g.recipient_email ?? null, null)
    assert.ok(tables.stripe_payments.some(p => p.stripe_session_id === 'cs_test_DL'), 'payment record kept')
    // a redeemed gift still reports Redeemed, not Closed
    const used = tables.sprint_gifts.find(x => x.status === 'redeemed')!
    assert.deepEqual(await routes.gifts.publicGiftState({ token: String(used.token) }), { state: 'redeemed' })
  } finally { sprintRedeemBy = saved }
  // before the deadline it works
  const ok = await routes.redeem.POST(post('/api/sprint/redeem', { token: g.token, name: 'On Time', email: 'ontime@example.test' }))
  assert.equal(ok.status, 200)
})

// ---------- Sprint self registration ----------
test('self registration: register, pay, paid once, emails once; nothing marked paid without the webhook', async () => {
  const register = await import('../app/api/sprint/register/route')
  const bad = await register.POST(post('/api/sprint/register', { name: 'X', email: 'nope' }))
  assert.equal(bad.status, 400)
  const before = tables.sprint_registrations?.length ?? 0

  const r = await register.POST(post('/api/sprint/register', { name: '  Sam   Participant ', email: 'Sam@Example.test', phone: '555 0100' }))
  assert.equal(r.status, 200)
  const { url } = await r.json()
  const u = new URL(url)
  assert.equal(u.origin + u.pathname, 'https://buy.stripe.com/eVq6oH9Pv3f70w784A3sI05', 'the existing Stripe link')
  assert.equal(u.searchParams.get('prefilled_email'), 'sam@example.test')
  const ref = u.searchParams.get('client_reference_id')!
  assert.match(ref, /^sprint_self_[0-9a-f-]{36}$/)
  assert.equal(tables.sprint_registrations.length, before + 1)
  const reg = tables.sprint_registrations.find(x => `sprint_self_${x.id}` === ref)!
  assert.equal(reg.name, 'Sam Participant'); assert.equal(reg.email, 'sam@example.test'); assert.equal(reg.phone, '555 0100')
  assert.equal(reg.status ?? 'pending_payment', 'pending_payment', 'not paid just for registering')
  assert.equal(reg.terms_version ?? null, null, 'no terms recorded while none are approved')

  const sentBefore = sent.length
  const paidEvent = () => stripeEvent('evt_reg', 'checkout.session.completed', { ...session('cs_test_REG', ref, 'pi_test_REG'), customer_details: { email: 'sam@example.test', name: 'Sam P' } })
  assert.equal((await routes.webhook.POST(paidEvent())).status, 200)
  assert.equal(reg.status, 'paid')
  assert.ok(reg.paid_at)
  assert.equal(reg.stripe_session_id, 'cs_test_REG')
  const pay = tables.stripe_payments.find(p => p.stripe_session_id === 'cs_test_REG')!
  assert.equal(pay.kind, 'sprint_self')
  assert.equal(reg.stripe_payment_id, pay.id)
  const newMail = sent.slice(sentBefore)
  assert.equal(newMail.filter(m => m.subject === 'You are registered for the 8 Pillar Sprint').length, 1, 'participant confirmation once')
  assert.equal(newMail.filter(m => m.subject.startsWith('New 8 Pillar Sprint registration: Sam Participant')).length, 1, 'John notice once, with the participant')
  assert.ok(newMail.every(m => m.to === 'test-inbox@example.test'), 'test inbox only outside production')

  // Stripe repeats the event and sends the async success too: nothing new
  await routes.webhook.POST(paidEvent())
  await routes.webhook.POST(stripeEvent('evt_reg2', 'checkout.session.async_payment_succeeded', { ...session('cs_test_REG', ref, 'pi_test_REG') }))
  assert.equal(sent.length, sentBefore + 2)
  assert.equal(tables.stripe_payments.filter(p => p.stripe_session_id === 'cs_test_REG').length, 1)
})

test('self registration: a failed bank payment is marked failed, not paid', async () => {
  const register = await import('../app/api/sprint/register/route')
  const { url } = await (await register.POST(post('/api/sprint/register', { name: 'Fay Failed', email: 'fay@example.test' }))).json()
  const ref = new URL(url).searchParams.get('client_reference_id')!
  await routes.webhook.POST(stripeEvent('evt_f1', 'checkout.session.async_payment_failed', { ...session('cs_test_F', ref, 'pi_test_F'), payment_status: 'unpaid' }))
  const reg = tables.sprint_registrations.find(x => `sprint_self_${x.id}` === ref)!
  assert.equal(reg.status, 'payment_failed')
})

test('an older plain Sprint link, or a registration not on record, still notifies John once', async () => {
  const before = sent.filter(m => m.subject.startsWith('New 8 Pillar Sprint registration')).length
  await routes.webhook.POST(stripeEvent('evt_old', 'checkout.session.completed', session('cs_test_OLD', 'sprint_self_00000000-0000-4000-8000-000000000000', 'pi_test_OLD')))
  await routes.webhook.POST(stripeEvent('evt_old', 'checkout.session.completed', session('cs_test_OLD', 'sprint_self_00000000-0000-4000-8000-000000000000', 'pi_test_OLD')))
  assert.equal(sent.filter(m => m.subject.startsWith('New 8 Pillar Sprint registration')).length, before + 1)
})
