/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/uploads/:path*',
        destination: 'http://localhost:8000/uploads/:path*',
      },
    ]
  },
}

module.exports = nextConfig
