/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['placeholder.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-scroll-parallax'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
