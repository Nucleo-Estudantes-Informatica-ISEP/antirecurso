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
        port: '',
        pathname: '/avatars/**'
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

export default nextConfig;
