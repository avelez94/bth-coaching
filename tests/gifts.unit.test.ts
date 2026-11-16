import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CODE_ALPHABET, CODE_PATTERN, generateCode, generateToken, isToken, normalizeCode, REDEEM_MESSAGE, redeemPath } from '../lib/sprint-gift-codes'
import { generateGiftCertificatePDF, CERTIFICATE_INSTRUCTION } from '../lib/gift-certificate-pdf'
import { giftCertificateEmail, giftRedeemedRecipientEmail, giftRedeemedAdminEmail, giftAdminNoticeEmail } from '../lib/email-templates'
import { SPRINT_PARTICIPANT_TERMS } from '../lib/sprint-terms'

test('gift tokens are 256 bit, url safe and unique', () => {
  const seen = new Set<string>()
  for (let i = 0; i < 5000; i++) {
    const t = generateToken()
    assert.ok(isToken(t), t)
    assert.equal(Buffer.from(t, 'base64url').length, 32)
    assert.ok(!seen.has(t)); seen.add(t)
  }
  assert.ok(!isToken('abc') && !isToken(`${generateToken()}x`) && !isToken(null))
})

test('gift codes match the database pattern, avoid look-alike characters, and are unique', () => {
  const seen = new Set<string>()
  for (let i = 0; i < 5000; i++) {
    const c = generateCode()
    assert.match(c, CODE_PATTERN)
    for (const ch of c.slice(7).replace(/-/g, '')) assert.ok(CODE_ALPHABET.includes(ch), ch)
    assert.ok(!/[01OIL]/.test(c.slice(7)))
    assert.ok(!seen.has(c)); seen.add(c)
  }
})

test('typed codes are normalized, junk is rejected', () => {
  assert.equal(normalizeCode('sprint 8f4k 2qx7 m9pd'), 'SPRINT-8F4K-2QX7-M9PD')
  assert.equal(normalizeCode('8F4K2QX7M9PD'), 'SPRINT-8F4K-2QX7-M9PD')
  assert.equal(normalizeCode(' SPRINT-8F4K-2QX7-M9PD '), 'SPRINT-8F4K-2QX7-M9PD')
  assert.equal(normalizeCode('SPRINT-8F4K'), null)
  assert.equal(normalizeCode("'; drop table sprint_gifts; --"), null)
})

test('redemption messages are the agreed wording and contain no personal data', () => {
  assert.equal(REDEEM_MESSAGE.invalid, 'This gift link is not valid.')
  assert.equal(REDEEM_MESSAGE.redeemed, 'This gift has already been redeemed.')
  for (const m of Object.values(REDEEM_MESSAGE)) assert.ok(!/@|—|–/.test(m))
  assert.equal(redeemPath('a+b/c'), '/sprint/redeem?token=a%2Bb%2Fc')
})

test('the certificate PDF is generated with the required content', async () => {
  const bytes = await generateGiftCertificatePDF({
    purchaserName: 'Pat Buyer', recipientName: null, code: 'SPRINT-AAAA-BBBB-CCCC',
    link: `https://example.test/sprint/redeem?token=${generateToken()}`, registerBy: 'January 5, 2027',
    dates: 'Eight Tuesdays', time: '7:00 PM', format: 'Video', terms: ['Gifts follow the same terms.'],
    contactName: 'John McCracken', contactEmail: 'john@example.test', contactPhone: '555', website: 'example.test',
  })
  const head = Buffer.from(bytes.slice(0, 5)).toString()
  assert.equal(head, '%PDF-')
  assert.ok(bytes.length > 10_000)
  assert.equal(CERTIFICATE_INSTRUCTION, 'Use this link/code to claim your Sprint seat and complete your registration.')
})

test('gift emails escape every value and mark test sends', () => {
  const footer = { contactEmail: 'john@example.test', phone: '555' }
  const evil = '<script>alert(1)</script>'
  const a = giftCertificateEmail({ purchaserName: evil, code: 'SPRINT-AAAA-BBBB-CCCC', link: 'https://x.test/r?token=t', registerBy: 'Jan 5', giftTerm: 'Gifts follow the same terms.' }, footer, 'real@buyer.test')
  assert.ok(!a.html.includes('<script>'))
  assert.ok(a.html.includes('TEST MODE') && a.html.includes('real@buyer.test'))
  assert.ok(a.text.includes('SPRINT-AAAA-BBBB-CCCC') && a.text.includes('https://x.test/r?token=t') && a.text.includes('Jan 5'))
  const live = giftCertificateEmail({ purchaserName: 'Pat', code: 'C', link: 'L', registerBy: 'D', giftTerm: '' }, footer, null)
  assert.ok(!live.html.includes('TEST MODE'))
  for (const e of [
    a, live,
    giftRedeemedRecipientEmail({ name: evil, purchaserName: evil, details: [['Dates', evil]] }, footer, null),
    giftRedeemedAdminEmail({ recipientName: evil, recipientEmail: 'r@x.test', recipientPhone: null, purchaserName: evil, purchaserEmail: 'p@x.test', code: 'C' }, footer),
    giftAdminNoticeEmail({ name: evil, email: 'p@x.test', amount: '$450.00', code: 'C', sessionRef: 'cs_test' }, footer),
  ]) {
    assert.ok(!e.html.includes('<script>'))
    assert.ok(!/ — | – /.test(e.text), 'no dashes in client facing copy')
  }
})

test('no participant agreement or terms step is active for the Sprint yet', () => {
  assert.equal(SPRINT_PARTICIPANT_TERMS, null)
})
