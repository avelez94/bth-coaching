// Fast checks that need no running server: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DESCRIPTION, PUBLIC_PAGES, SITE_NAME, SITE_URL, TAGLINE, homeDescription, jsonLd, pageMetadata, publicSiteUrl } from '../lib/seo'
import { redeemPath } from '../lib/sprint-gift-codes'
import { PAGE_DEFAULTS, PAGE_SCHEMA } from '../lib/site-content'
import { organization, website } from '../lib/structured-data'
import { DEFAULT_SETTINGS } from '../lib/site-settings'

const DASHES = /[‐-―−]|(?<=\s)-(?=\s)/

test('tagline is identical on the home page, meta description, link preview and structured data', () => {
  assert.equal(PAGE_DEFAULTS.home['hero.subhead'], TAGLINE)
  const m = pageMetadata('home', { description: homeDescription(PAGE_DEFAULTS.home['hero.subhead']) })
  assert.ok(String(m.description).startsWith(TAGLINE))
  assert.ok(String(m.openGraph?.description).startsWith(TAGLINE))
  assert.ok(String(m.twitter?.description).startsWith(TAGLINE))
  assert.equal(organization(TAGLINE, DEFAULT_SETTINGS).slogan, TAGLINE)
  assert.equal(website(TAGLINE).description, TAGLINE)
})

test('every public page in the admin has search metadata, and every one is unique', () => {
  const paths = Object.values(PAGE_SCHEMA).map(p => p.path).sort()
  assert.deepEqual(Object.values(PUBLIC_PAGES).map(p => p.path).sort(), paths)
  const titles = new Set(Object.values(PUBLIC_PAGES).map(p => p.title))
  const descs = new Set(Object.values(PUBLIC_PAGES).map(p => p.description))
  assert.equal(titles.size, paths.length)
  assert.equal(descs.size, paths.length)
})

test('no dashes in any title or description shown in search results or previews', () => {
  for (const t of [SITE_NAME, TAGLINE, DESCRIPTION, ...Object.values(PUBLIC_PAGES).flatMap(p => [p.title, p.description])]) {
    assert.ok(!DASHES.test(t), `dash found in: ${t}`)
  }
})

test('structured data can never break out of its script tag', () => {
  const evil = '</script><script>alert(1)</script> & \u2028'
  const out = jsonLd({ name: evil })
  assert.ok(!out.includes('<') && !out.includes('>') && !out.includes('&') && !out.includes('\u2028'))
  assert.deepEqual(JSON.parse(out), { name: evil })
})

test('links sent to clients never use a Vercel hosting address', () => {
  assert.equal(publicSiteUrl('https://bth-coaching.vercel.app'), 'https://mccrackencoaching.com')
  assert.equal(publicSiteUrl('https://bth-coaching-git-main-cutrated-mile.vercel.app/'), 'https://mccrackencoaching.com')
  assert.equal(publicSiteUrl(undefined), 'https://mccrackencoaching.com')
  assert.equal(publicSiteUrl('not a url'), 'https://mccrackencoaching.com')
  assert.equal(publicSiteUrl('http://mccrackencoaching.com'), 'https://mccrackencoaching.com')
  assert.equal(publicSiteUrl('https://mccrackencoaching.com/'), 'https://mccrackencoaching.com')
  assert.equal(publicSiteUrl('https://www.mccrackencoaching.com'), 'https://www.mccrackencoaching.com')
  assert.ok(!SITE_URL.includes('vercel.app'))
})

test('a gift certificate link is on the real domain, even if the setting is a Vercel address', () => {
  const link = `${publicSiteUrl('https://bth-coaching.vercel.app')}${redeemPath('A'.repeat(43))}`
  assert.ok(link.startsWith('https://mccrackencoaching.com/sprint/redeem?token='), link)
})
