/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
  },
  async headers() {
    // Account, admin and exam-session pages are never indexed (robots.txt alone does not de-index).
    const sources = [
      'login',
      'register',
      'profile',
      'account',
      'conta',
      'reset-password',
      'stats',
      'admin'
    ].map((p) => `/:lang(pt|en)/${p}/:path*`);
    sources.push('/:lang(pt|en)/exams/:id/(answer|points|review)/:path*');
    return sources.map((source) => ({
      source,
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
    }));
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gravatar.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: ''
      }
    ],
    minimumCacheTTL: 60
  }
};

module.exports = nextConfig;
