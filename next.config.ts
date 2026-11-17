import type { NextConfig } from "next";

const noindex = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
const isProduction = process.env.VERCEL_ENV === 'production'

const nextConfig: NextConfig = {
  // Local dev only: do not generate editor helper files in the project
  agentRules: false,
  // Put titles, descriptions and link preview tags in the first HTML the
  // server sends, for every visitor and crawler, without needing JavaScript.
  htmlLimitedBots: /.*/,
  async headers() {
    return [
      // Never index admin, enrollment, checkout or API responses
      { source: '/admin/:path*', headers: noindex },
      { source: '/admin', headers: noindex },
      { source: '/enroll/:path*', headers: noindex },
      { source: '/enroll', headers: noindex },
      { source: '/api/:path*', headers: noindex },
      // Sprint gift redemption: private links, never indexed, cached or
      // passed on to other sites as a referrer
      { source: '/sprint/register', headers: [...noindex, { key: 'Cache-Control', value: 'private, no-store' }] },
      { source: '/sprint/redeem', headers: [
        ...noindex,
        { key: 'Referrer-Policy', value: 'no-referrer' },
        { key: 'Cache-Control', value: 'private, no-store' },
      ] },
      // Preview and test copies of the site: nothing is indexed
      ...(isProduction ? [] : [{ source: '/:path*', headers: noindex }]),
    ]
  },
  // Fonts and logo read at runtime by the agreement and gift certificate PDFs
  outputFileTracingIncludes: {
    '/api/enroll/submit': ['./lib/pdf-assets/**/*'],
    '/api/stripe/webhook': ['./lib/pdf-assets/**/*'],
    '/api/admin/sprint-gifts': ['./lib/pdf-assets/**/*'],
  },
  async redirects() {
    return [
      {
        source: '/transition-coaching',
        destination: '/executive-coaching',
        permanent: true,
      },
      {
        source: '/mission-ready-leadership',
        destination: '/leader-development',
        permanent: true,
      },
      {
        source: '/leadership-consulting',
        destination: '/for-organizations',
        permanent: true,
      },
      {
        source: '/individual',
        destination: '/executive-coaching',
        permanent: true,
      },
      {
        source: '/the-framework',
        destination: '/the-8-pillars',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
