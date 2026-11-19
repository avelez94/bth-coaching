import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { mainBookingUrl } from '../lib/site-settings'

const src = (f: string) => readFileSync(f, 'utf8')

test('general buttons use the Main Booking Page, falling back to Individual', () => {
  assert.equal(mainBookingUrl({ bookingMainUrl: 'https://main', bookingFreeCallUrl: 'https://ind' }), 'https://main')
  assert.equal(mainBookingUrl({ bookingMainUrl: '  ', bookingFreeCallUrl: 'https://ind' }), 'https://ind')
})

test('each booking button uses the right Admin link', () => {
  // Main Booking Page: navigation (desktop and phone), footer, Home, About, Contact closing
  assert.match(src('app/(public)/layout.tsx'), /<Nav bookingUrl=\{mainBookingUrl\(settings\)\}/)
  assert.match(src('app/components/footer.tsx'), /ScheduleButton url=\{mainBookingUrl\(settings\)\}/)
  assert.match(src('app/(public)/page.tsx'), /bookingUrl=\{props\.booking\?\.main\}/)
  assert.match(src('app/(public)/about/view.tsx'), /href=\{booking\.main\}/)
  assert.match(src('app/(public)/contact/view.tsx'), /url=\{booking\?\.main\} className="btn-closing-schedule"/)
  // Individual Consultation: individual service pages
  for (const f of ['executive-coaching', 'leader-development']) {
    const s = src(`app/(public)/${f}/view.tsx`)
    assert.ok(s.includes('booking?.free') && !s.includes('booking?.org') && !s.includes('booking?.main'), f)
  }
  assert.ok(src('app/(public)/sprint/view.tsx').includes('booking?.free'))
  // Organizational Consultation: organization pages
  for (const f of ['for-organizations', 'sample-engagements']) {
    const s = src(`app/(public)/${f}/view.tsx`)
    assert.ok(s.includes('booking?.org') && !s.includes('booking?.free') && !s.includes('booking?.main'), f)
  }
  // Paired buttons: Individual beside Organizational on The 8 Pillars and Contact
  for (const f of ['the-8-pillars', 'contact']) {
    const s = src(`app/(public)/${f}/view.tsx`)
    assert.ok(s.includes('booking?.free') && s.includes('booking?.org'), f)
  }
})

test('contact form: hidden trap field, timing check and hourly limits', () => {
  const route = src('app/api/contact/route.ts')
  assert.match(route, /body\?\.website/)
  assert.match(route, /MIN_FILL_MS/)
  assert.match(route, /attempts\('contact-ip'/)
  assert.match(route, /attempts\('contact-email'/)
  assert.match(route, /status: 429/)
  const view = src('app/(public)/contact/view.tsx')
  assert.match(view, /id="website"[^>]*tabIndex=\{-1\}/)
  assert.match(view, /elapsedMs: Date\.now\(\) - openedAt\.current/)
})

test('contact form: phone and email are required', () => {
  const route = src('app/api/contact/route.ts')
  assert.match(route, /!name \|\| !email \|\| !phone \|\| !message/)
  assert.match(route, /phone\.replace\(\/\\D\/g, ''\)\.length < 10/)
  const view = src('app/(public)/contact/view.tsx')
  assert.match(view, /id="phone"[\s\S]{0,300}required/)
  assert.match(view, /id="email"[\s\S]{0,300}required/)
})

test('quote under the navigation: exact default wording, editable, blank hides it', async () => {
  const { DEFAULT_SETTINGS, SETTING_KEYS, validateSetting } = await import('../lib/site-settings')
  assert.equal(DEFAULT_SETTINGS.navQuote, 'The winds and the waves are always on the side of the ablest navigator')
  assert.equal(DEFAULT_SETTINGS.navQuoteAttribution, 'Edward Gibbon')
  assert.equal(SETTING_KEYS.navQuote, 'nav_quote')
  assert.deepEqual(validateSetting('navQuote', '  “Hello” '), { ok: true, value: 'Hello' })
  assert.deepEqual(validateSetting('navQuote', ''), { ok: true, value: '' })
  assert.equal(validateSetting('navQuote', 'x'.repeat(200)).ok, false)
  for (const f of ['app/(public)/layout.tsx', 'app/not-found.tsx', 'app/admin/preview/[page]/preview-client.tsx'])
    assert.match(src(f), /<Nav bookingUrl=\{mainBookingUrl\(settings\)\} visible=\{visible\} quote=\{\{ text: settings\.navQuote, by: settings\.navQuoteAttribution \}\} \/>/)
  assert.doesNotMatch(src('app/components/nav.tsx'), /—|&mdash;/)
})
