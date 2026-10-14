import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
