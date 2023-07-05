/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
  },
  images: {
    domains: ['gravatar.com', 'i.ibb.co'],
    minimumCacheTTL: 60
  }
};

module.exports = nextConfig;
