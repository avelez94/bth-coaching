// ============================================================
// A local stand-in for the parts of the Stripe API the installment code
// uses, modelled on Stripe's documented behavior:
//  * POST /v1/subscription_schedules {from_subscription} builds one phase
//    from the subscription's own settings, with end_behavior "release".
//    A subscription can only have one schedule. Idempotency keys return
//    the first response.
//  * POST /v1/subscription_schedules/:id replaces the phases. As Stripe
//    documents, any phase setting that is not passed again is UNSET:
//    leaving out the discount drops the promo code, leaving out
//    automatic_tax turns tax off, and so on. Unknown parameters
//    (including the removed "iterations") are rejected.
//  * With end_behavior "cancel", the subscription's cancel_at becomes the
//    end of the last phase.
//  * As seen on the live account (Nov 17 2026): when the schedule update
//    re-applies a discount, Stripe issues a NEW discount ID for the same
//    coupon and promotion code. A subscription returns discount IDs unless
//    expand[]=discounts is asked for.
// paymentsBeforeEnd() counts the monthly charges Stripe would make.
// ============================================================
import { addMonthsUTC } from '../../lib/installment-plan'

type Obj = Record<string, unknown>
export interface Req { method: string; path: string; body: Obj; idempotencyKey?: string; version?: string; auth?: string }

export function parseForm(s: string): Obj {
  const root: Obj = {}
  for (const pair of s.split('&').filter(Boolean)) {
    const [k, v = ''] = pair.split('=').map(decodeURIComponent)
    const keys = k.replace(/\]/g, '').split('[')
    let cur: Obj = root
    keys.forEach((key, i) => {
      if (i === keys.length - 1) { cur[key] = v; return }
      cur[key] ??= /^\d+$/.test(keys[i + 1]) ? [] : {}
      cur = cur[key] as Obj
    })
  }
  return root
}

const PHASE_PARAMS = new Set(['add_invoice_items', 'application_fee_percent', 'automatic_tax', 'billing_cycle_anchor', 'billing_thresholds', 'collection_method',
  'currency', 'default_payment_method', 'default_tax_rates', 'description', 'discounts', 'duration', 'end_date', 'invoice_settings', 'items', 'metadata',
  'on_behalf_of', 'proration_behavior', 'start_date', 'transfer_data', 'trial', 'trial_end'])

export class FakeStripe {
  subs = new Map<string, Obj>()
  schedules = new Map<string, Obj>()
  requests: Req[] = []
  private idem = new Map<string, unknown>()
  failNextScheduleUpdate = 0
  extraPhaseField: Obj | null = null
  private n = 0

  addSubscription(o: { id: string; start: number; amount?: number; promo?: boolean; tax?: boolean; interval?: string; repeating?: boolean }) {
    const sub: Obj = {
      id: o.id, object: 'subscription', status: 'active', customer: 'cus_' + o.id, currency: 'usd',
      start_date: o.start, billing_cycle_anchor: o.start, cancel_at: null, cancel_at_period_end: false, schedule: null,
      // ALANTETEST, 100% off forever (or a repeating coupon whose end restarts if re-issued)
      discounts: o.promo === false ? [] : [{ id: 'di_' + o.id, object: 'discount', source: { type: 'coupon', coupon: 'coupon_alantetest' }, promotion_code: 'promo_alantetest',
        end: o.repeating ? addMonthsUTC(o.start, 3) : null, _repeating: Boolean(o.repeating) }],
      automatic_tax: { enabled: o.tax !== false, liability: { type: 'self' } },
      default_payment_method: 'pm_' + o.id,
      metadata: { from: 'payment_link' },
      items: { data: [{ id: 'si_' + o.id, quantity: 1, current_period_start: o.start, current_period_end: addMonthsUTC(o.start, 1),
        price: { id: 'price_monthly_600', unit_amount: o.amount ?? 60000, currency: 'usd', recurring: { interval: o.interval ?? 'month', interval_count: 1 } } }] },
    }
    this.subs.set(o.id, sub)
    return sub
  }

  paymentsBeforeEnd(subId: string): number | 'unlimited' {
    const s = this.subs.get(subId)!
    if (s.cancel_at == null) return 'unlimited'
    let k = 0
    while (addMonthsUTC(s.start_date as number, k) < (s.cancel_at as number)) k++
    return k
  }

  posts() { return this.requests.filter(r => r.method === 'POST') }

  fetch = async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const u = new URL(String(input))
    const h = (init?.headers ?? {}) as Record<string, string>
    const req: Req = { method: init?.method ?? 'GET', path: u.pathname, body: init?.body ? parseForm(String(init.body)) : {}, idempotencyKey: h['Idempotency-Key'], version: h['Stripe-Version'], auth: h.Authorization }
    this.requests.push(req)
    const json = (status: number, b: unknown) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json' } })
    const err = (status: number, message: string) => json(status, { error: { message, type: 'invalid_request_error' } })
    const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x))

    if (req.idempotencyKey && this.idem.has(req.idempotencyKey)) return json(200, clone(this.idem.get(req.idempotencyKey)))

    let m = u.pathname.match(/^\/v1\/subscriptions\/([^/]+)$/)
    if (m && req.method === 'GET') {
      const s = this.subs.get(m[1]); if (!s) return err(404, 'No such subscription')
      const out = clone(s)
      const expanded = [...u.searchParams.entries()].some(([k, v]) => k.startsWith('expand') && v === 'discounts')
      if (!expanded) out.discounts = (out.discounts as Obj[]).map(d => d.id)
      return json(200, out)
    }
    m = u.pathname.match(/^\/v1\/subscription_schedules\/([^/]+)$/)
    if (m && req.method === 'GET') {
      const s = this.schedules.get(m[1]); return s ? json(200, clone(s)) : err(404, 'No such schedule')
    }
    if (u.pathname === '/v1/subscription_schedules' && req.method === 'POST') {
      const subId = String(req.body.from_subscription ?? '')
      const sub = this.subs.get(subId)
      if (!sub) return err(404, 'No such subscription')
      if (Object.keys(req.body).some(k => k !== 'from_subscription' && k !== 'metadata')) return err(400, 'You cannot set other parameters with from_subscription')
      if (sub.schedule) return err(400, 'This subscription is already attached to a schedule')
      const item = (sub.items as { data: Obj[] }).data[0]
      const id = `sub_sched_${++this.n}`
      const sched: Obj = {
        id, object: 'subscription_schedule', status: 'active', end_behavior: 'release', subscription: subId, customer: sub.customer, metadata: {},
        phases: [{
          start_date: item.current_period_start, end_date: item.current_period_end,
          items: [{ price: (item.price as Obj).id, plan: (item.price as Obj).id, quantity: item.quantity, discounts: [], metadata: {}, tax_rates: [], billing_thresholds: null }],
          discounts: (sub.discounts as Obj[]).map(d => ({ coupon: null, discount: d.id, promotion_code: null })),
          automatic_tax: { ...(sub.automatic_tax as Obj), disabled_reason: null },
          currency: sub.currency, default_payment_method: sub.default_payment_method, default_tax_rates: [],
          collection_method: 'charge_automatically', description: null,
          invoice_settings: { account_tax_ids: null, days_until_due: null, issuer: { type: 'self' } },
          metadata: {}, on_behalf_of: null, proration_behavior: 'create_prorations', transfer_data: null, application_fee_percent: null,
          billing_cycle_anchor: null, billing_thresholds: null, add_invoice_items: [], trial_end: null,
          ...(this.extraPhaseField ?? {}),
        }],
      }
      this.schedules.set(id, sched)
      sub.schedule = id
      if (req.idempotencyKey) this.idem.set(req.idempotencyKey, clone(sched))
      return json(200, clone(sched))
    }
    if (m && req.method === 'POST') {
      if (this.failNextScheduleUpdate > 0) { this.failNextScheduleUpdate--; return err(500, 'Temporary Stripe error') }
      const sched = this.schedules.get(m[1])
      if (!sched) return err(404, 'No such schedule')
      const sub = this.subs.get(String(sched.subscription))!
      const phases = req.body.phases as Obj[] | undefined
      if (!phases?.length) return err(400, 'phases required')
      const p = phases[0]
      for (const k of Object.keys(p)) if (!PHASE_PARAMS.has(k)) return err(400, `Received unknown parameter: phases[0][${k}]`)
      const cur = (sched.phases as Obj[])[0]
      if (Number(p.start_date) !== cur.start_date) return err(400, 'You can not modify the start date of the current phase')
      const dur = p.duration as Obj | undefined
      const end = dur ? addMonthsUTC(Number(p.start_date), Number(dur.interval_count)) : p.end_date ? Number(p.end_date) : null
      const items = p.items as Obj[]
      // As documented: settings not passed again are unset
      // A discount ID that is no longer on the subscription is rejected
      for (const d of (p.discounts as Obj[] | undefined) ?? []) {
        if (d.discount && !(sub.discounts as Obj[]).some(x => x.id === d.discount)) return err(400, `No such discount: '${d.discount}'`)
      }
      // Re-applying a discount issues a new discount ID for the same coupon
      const discounts: Obj[] = ((p.discounts as Obj[] | undefined) ?? []).map(d => {
        const old = (sub.discounts as Obj[]).find(x => x.id === d.discount)
        const base = old ?? { source: { type: 'coupon', coupon: d.coupon ?? null }, promotion_code: d.promotion_code ?? null, end: null, _repeating: false }
        return { ...base, id: `di_new_${++this.n}`, object: 'discount', end: base._repeating ? addMonthsUTC(Number(p.start_date), 3) + 86400 * 5 : base.end }
      })
      sched.phases = [{
        ...cur, end_date: end,
        items: items.map(i => ({ price: i.price, plan: i.price, quantity: Number(i.quantity ?? 1), discounts: [], metadata: i.metadata ?? {}, tax_rates: [], billing_thresholds: null })),
        discounts: discounts.map(d => ({ coupon: null, discount: d.id, promotion_code: null })),
        automatic_tax: { enabled: (p.automatic_tax as Obj | undefined)?.enabled === 'true', liability: { type: 'self' }, disabled_reason: null },
        default_payment_method: p.default_payment_method ?? null,
        metadata: p.metadata ?? {},
      }]
      sched.end_behavior = req.body.end_behavior ?? sched.end_behavior
      sched.metadata = req.body.metadata ?? sched.metadata
      const item = (sub.items as { data: Obj[] }).data[0]
      item.quantity = Number(items[0].quantity ?? 1)
      ;(item.price as Obj).id = items[0].price
      sub.discounts = discounts
      sub.automatic_tax = { enabled: (p.automatic_tax as Obj | undefined)?.enabled === 'true', liability: { type: 'self' } }
      sub.default_payment_method = p.default_payment_method ?? null
      if (p.metadata) sub.metadata = p.metadata
      sub.cancel_at = sched.end_behavior === 'cancel' ? end : null
      return json(200, clone(sched))
    }
    return err(404, `Unhandled ${req.method} ${u.pathname}`)
  }
}
