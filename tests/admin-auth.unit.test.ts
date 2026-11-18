import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { checkPassword, hashPassword, passwordProblem, sha256, looksLikeEmail, normalizeEmail } from '../lib/admin-auth'
import { adminInviteEmail, adminPasswordChangedEmail, adminResetEmail } from '../lib/email-templates'

const footer = { contactEmail: 'john@mccrackencoaching.com', phone: '703-343-6960' }

test('passwords: stored only as a salted scrypt hash and checked correctly', async () => {
  const h1 = await hashPassword('a quiet harbor at dawn')
  const h2 = await hashPassword('a quiet harbor at dawn')
  assert.match(h1, /^scrypt\$32768\$8\$1\$/)
  assert.ok(!h1.includes('harbor'))
  assert.notEqual(h1, h2, 'each hash has its own salt')
  assert.equal(await checkPassword('a quiet harbor at dawn', h1), true)
  assert.equal(await checkPassword('a quiet harbor at dusk', h1), false)
  assert.equal(await checkPassword('anything', null), false, 'no stored password never matches')
  assert.equal(await checkPassword('anything', 'garbage'), false)
})

test('new passwords: length, match, and easy guesses are rejected', () => {
  assert.match(passwordProblem('short', 'short')!, /12 characters/)
  assert.match(passwordProblem('long enough phrase', 'different phrase!')!, /do not match/)
  assert.match(passwordProblem('aaaaaaaaaaaaaa', 'aaaaaaaaaaaaaa')!, /repeated/)
  assert.match(passwordProblem('Password1234', 'Password1234')!, /easy to guess/)
  assert.match(passwordProblem('johnsecretphrase', 'johnsecretphrase', 'john@mccrackencoaching.com')!, /email name/)
  assert.equal(passwordProblem('x'.repeat(129), 'x'.repeat(129)), 'Use 128 characters or fewer.')
  assert.equal(passwordProblem('a quiet harbor at dawn', 'a quiet harbor at dawn', 'john@mccrackencoaching.com'), null)
})

test('tokens are stored as SHA-256 hashes; emails normalized', () => {
  assert.equal(sha256('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  assert.equal(normalizeEmail('  John@McCrackenCoaching.com '), 'john@mccrackencoaching.com')
  assert.equal(looksLikeEmail('dev@example.com'), true)
  assert.equal(looksLikeEmail('not an email'), false)
})

test('Admin emails: production links, token only after #, never in the subject, no password, no dashes', () => {
  const token = 'TOKEN_abcdefghijklmnopqrstuvwxyz0123456789'
  const reset = adminResetEmail({ name: 'John McCracken', link: `https://mccrackencoaching.com/admin/reset#token=${token}`, minutes: 30 }, footer)
  const invite = adminInviteEmail({ inviterName: 'John McCracken', link: `https://mccrackencoaching.com/admin/invite#token=${token}`, expires: 'November 20, 2026 at 8:00 AM EST' }, footer)
  const changed = adminPasswordChangedEmail({ name: 'John McCracken', when: 'November 18, 2026 at 8:00 AM EST', how: 'changed' }, footer)
  for (const m of [reset, invite]) {
    assert.ok(m.html.includes('https://mccrackencoaching.com/admin/'), 'production domain')
    assert.ok(m.text.includes(`#token=${token}`))
    assert.ok(!m.subject.includes(token))
    assert.ok(!/vercel\.app/.test(m.html + m.text))
  }
  for (const m of [reset, invite, changed]) {
    assert.ok(!/^\s*(new |temporary )?password\s*:/im.test(m.text), 'no password field in the email')
    assert.ok(!/[–—]/.test(m.subject + m.html + m.text), 'no dashes')
  }
})

test('every Admin API route checks the session; Users & Access is Owner only', () => {
  const routes = ['images', 'agreements', 'content', 'page-status', 'settings', 'sprint-purchases', 'email', 'sprint-gifts', 'pricing', 'signed-agreements', 'signed-agreements/resend']
  for (const r of routes) {
    const src = readFileSync(`app/api/admin/${r}/route.ts`, 'utf8')
    const handlers = src.match(/export async function (GET|POST|PUT|PATCH|DELETE)/g) ?? []
    const checks = src.match(/await verifyAdminToken\(req\)/g) ?? []
    assert.ok(handlers.length > 0 && checks.length >= handlers.length, `${r}: each handler checks the session`)
  }
  const users = readFileSync('app/api/admin/users/route.ts', 'utf8')
  assert.equal((users.match(/await requireOwner\(req\)/g) ?? []).length, 2, 'GET and POST are Owner only')
  assert.ok(!/role:\s*'owner'/.test(users), 'no code path here creates an Owner')
})
