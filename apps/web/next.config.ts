import type { NextConfig } from 'next';

// Browser traffic to /api/* is rewritten to the Express API's origin. This
// keeps the admin session cookie first-party (host-only, scoped to this
// site's own domain) instead of needing to be shared across two separate
// *.vercel.app subdomains, which the Public Suffix List makes impossible.
// Server Components bypass this and call API_BASE_URL directly (see lib/api.ts).
const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:4000';

const nextConfig: NextConfig = {
  transpilePackages: ['@portfolio/shared'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_BASE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
