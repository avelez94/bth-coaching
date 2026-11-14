import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        source: '/the-framework',
        destination: '/the-8-pillars',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
