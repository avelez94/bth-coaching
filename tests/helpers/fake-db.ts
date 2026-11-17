// In-memory stand-in for the Supabase tables used by route tests (same as in gifts.flow.test.ts).
import { randomUUID } from 'node:crypto'

export type Row = Record<string, unknown>
export const tables: Record<string, Row[]> = { stripe_payments: [], sprint_gifts: [], email_log: [], enrollments: [] }
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
        const row: Row = { id: randomUUID(), created_at: new Date().toISOString(), status: this.t === 'sprint_gifts' ? 'purchased' : undefined, ...p }
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
export const fakeDb = { from: (t: string) => new Q(t) }
