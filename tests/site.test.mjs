// Checks against a running copy of the site: BASE_URL=http://localhost:3000 npm run test:site
// Run against a production build with VERCEL_ENV=production to test the indexable site,
// or without it to test that preview copies stay out of search engines.
import { test } from 'node:test'
import assert from 'node:assert/strict'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const PROD = process.env.EXPECT_INDEXABLE === '1'
const SITE = (process.env.EXPECT_SITE_URL || 'https://mccrackencoaching.com').replace(/\/$/, '')
const PAGES = ['/', '/executive-coaching', '/leader-development', '/for-organizations', '/sample-engagements', '/the-8-pillars', '/about', '/contact']
const TAGLINE = 'I help leaders gain clarity and get results, without sacrificing everything else.'

const get = (path, opts = {}) => fetch(BASE + path, { redirect: 'manual', ...opts })
const decode = s => s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const headOf = html => html.slice(0, html.indexOf('</head>'))
const meta = (head, attr, name) => {
  const m = head.match(new RegExp(`<meta[^>]*${attr}="${name}"[^>]*content="([^"]*)"`)) || head.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${name}"`))
  return m ? decode(m[1]) : null
}

const seen = { titles: new Set(), descs: new Set() }
for (const path of PAGES) {
  test(`${path}: own title, description, canonical and link preview in the server HTML head`, async () => {
    const r = await get(path)
    assert.equal(r.status, 200)
    const head = headOf(await r.text())
    const title = decode(head.match(/<title>([^<]*)<\/title>/)[1])
    const desc = meta(head, 'name', 'description')
    assert.ok(title && desc)
    assert.ok(!seen.titles.has(title), 'duplicate title'); seen.titles.add(title)
    assert.ok(!seen.descs.has(desc), 'duplicate description'); seen.descs.add(desc)
    const canonical = head.match(/<link rel="canonical" href="([^"]*)"/)[1]
    assert.equal(canonical, path === '/' ? SITE : SITE + path)
    for (const p of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type', 'og:site_name']) assert.ok(meta(head, 'property', p), p)
    for (const n of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) assert.ok(meta(head, 'name', n), n)
    assert.equal(meta(head, 'name', 'twitter:card'), 'summary_large_image')
    assert.equal(meta(head, 'property', 'og:image:width'), '1200')
    const robots = meta(head, 'name', 'robots')
    if (PROD) assert.equal(robots, 'index, follow')
    else assert.match(robots, /noindex/)
  })
}

test('home: tagline is word for word the same on the page, meta description, link preview and structured data', async () => {
  const html = await (await get('/')).text()
  const head = headOf(html)
  const shown = decode(html.match(/class="hero-subhead"[^>]*>([^<]*)</)[1])
  assert.equal(shown, TAGLINE)
  for (const v of [meta(head, 'name', 'description'), meta(head, 'property', 'og:description'), meta(head, 'name', 'twitter:description')]) assert.ok(v.startsWith(shown), v)
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g)].flatMap(m => [].concat(JSON.parse(m[1])))
  const org = ld.find(x => x['@type'] === 'Organization'), site = ld.find(x => x['@type'] === 'WebSite')
  assert.equal(org.slogan, shown)
  assert.equal(site.description, shown)
  assert.equal(org.url, SITE)
})

for (const [path, name] of [['/executive-coaching', 'Executive Coaching'], ['/leader-development', '8 Pillars Leadership Program']]) {
  test(`${path}: Service structured data with the price shown on the page`, async () => {
    const html = await (await get(path)).text()
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]*)<\/script>/)[1])
    assert.equal(ld['@type'], 'Service'); assert.equal(ld.name, name)
    assert.equal(ld.offers.priceCurrency, 'USD'); assert.equal(ld.offers.availability, 'https://schema.org/InStock')
    const dollars = Number(ld.offers.price).toLocaleString('en-US', { maximumFractionDigits: 2 })
    assert.ok(html.includes('$' + dollars), `page should show $${dollars}`)
  })
}

test('sitemap.xml lists every public page and nothing private', async () => {
  const r = await get('/sitemap.xml'); assert.equal(r.status, 200)
  const xml = await r.text()
  const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map(m => m[1])
  if (!PROD) return assert.equal(locs.length, 0)
  assert.deepEqual(locs.sort(), PAGES.map(p => (p === '/' ? SITE : SITE + p)).sort())
})

test('robots.txt', async () => {
  const txt = await (await get('/robots.txt')).text()
  if (PROD) {
    assert.match(txt, new RegExp(`Sitemap: ${SITE}/sitemap.xml`))
    for (const d of ['/admin', '/api/', '/enroll']) assert.ok(txt.includes(`Disallow: ${d}`), d)
  } else {
    assert.match(txt, /Disallow: \/\s*$/m)
    assert.ok(!/Allow: \//.test(txt))
  }
})

test('unknown pages return a real 404 and are not indexed', async () => {
  const r = await get('/this-page-does-not-exist')
  assert.equal(r.status, 404)
  assert.match(headOf(await r.text()), /noindex/)
})

for (const [from, to] of [['/individual', '/executive-coaching'], ['/transition-coaching', '/executive-coaching'], ['/mission-ready-leadership', '/leader-development'], ['/leadership-consulting', '/for-organizations'], ['/the-framework', '/the-8-pillars']]) {
  test(`old link ${from} permanently redirects to ${to}`, async () => {
    const r = await get(from)
    assert.equal(r.status, 308)
    assert.equal(new URL(r.headers.get('location'), BASE).pathname, to)
  })
}

test('admin, enrollment and API are never indexed', async () => {
  for (const p of ['/admin', '/enroll', '/api/enroll/test-mode']) {
    const r = await get(p)
    assert.match(r.headers.get('x-robots-tag') || '', /noindex/, p)
  }
  assert.match(headOf(await (await get('/admin')).text()), /noindex/)
})
