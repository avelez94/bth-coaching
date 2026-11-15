import type { NextConfig } from "next";

const noindex = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
const isProduction = process.env.VERCEL_ENV === 'production'

const nextConfig: NextConfig = {
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
      // Preview and test copies of the site: nothing is indexed
      ...(isProduction ? [] : [{ source: '/:path*', headers: noindex }]),
    ]
  },
  // Fonts and logo read at runtime by the signed agreement PDF generator
  outputFileTracingIncludes: {
    '/api/enroll/submit': ['./lib/pdf-assets/**/*'],
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
