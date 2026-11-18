import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CODE_ALPHABET, CODE_PATTERN, generateCode, generateToken, isToken, normalizeCode, REDEEM_MESSAGE, redeemPath } from '../lib/sprint-gift-codes'
import { generateGiftCertificatePDF, CERTIFICATE_INSTRUCTION } from '../lib/gift-certificate-pdf'
import { giftCertificateEmail, giftRedeemedRecipientEmail, giftRedeemedAdminEmail, giftAdminNoticeEmail } from '../lib/email-templates'
import { SPRINT_PARTICIPANT_TERMS, sprintTermsFor } from '../lib/sprint-terms'

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
    link: `https://example.test/sprint/redeem?token=${generateToken()}`, registerBy: 'January 10, 2027',
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
  const a = giftCertificateEmail({ purchaserName: evil, code: 'SPRINT-AAAA-BBBB-CCCC', link: 'https://x.test/r?token=t', registerBy: 'Jan 10', giftTerm: 'Gifts follow the same terms.' }, footer, 'real@buyer.test')
  assert.ok(!a.html.includes('<script>'))
  assert.ok(a.html.includes('TEST MODE') && a.html.includes('real@buyer.test'))
  assert.ok(a.text.includes('SPRINT-AAAA-BBBB-CCCC') && a.text.includes('https://x.test/r?token=t') && a.text.includes('Jan 10'))
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

test('Sprint participant terms: John\'s approved acknowledgment, one date for everything', () => {
  const t = SPRINT_PARTICIPANT_TERMS!
  assert.ok(t, 'active')
  assert.equal(t.acceptLabel, 'I have read and accept the 8 Pillar Sprint participant terms.')
  assert.equal(t.version, 'sprint-terms-2026-11-17')
  const filled = sprintTermsFor('2027-01-10T23:59:59-05:00')!
  assert.ok(filled.text.includes('Until January 10, 2027: full refund, or transfer your seat to someone else.'))
  assert.ok(filled.text.includes('After January 10: fees are non-refundable.'))
  assert.ok(filled.text.includes('how anonymized information either stays in the room or may be shared'))
  assert.ok(filled.text.includes('Time: 7:00 to 8:15 PM Eastern'))
  assert.ok(!/January 5|\{deadline/.test(filled.text))
  assert.ok(!/agreement|signature|waiver|arbitration|indemn/i.test(filled.text), 'no coaching agreement or new legal terms')
})
