/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
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
