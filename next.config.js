/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.aytix.uz",
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
    const baseUrl = apiUrl.replace("/api/v1", "")

    return [
      {
        source: "/api/uploads/:path*",
        destination: `${baseUrl}/uploads/:path*`,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.jivosite.com https://code.jivosite.com blob:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: blob: http://localhost:8000 http://127.0.0.1:8000 https://api.aytix.uz https://*.aytix.uz https://images.unsplash.com https://*.unsplash.com https://*.jivosite.com https://upload.wikimedia.org",
              "media-src 'self' blob: http://localhost:8000 http://127.0.0.1:8000 https://api.aytix.uz https://*.aytix.uz",
              "connect-src 'self' ws://localhost:3004 wss://localhost:3004 http://localhost:8000 http://127.0.0.1:8000 https://api.aytix.uz https://*.aytix.uz https://*.jivosite.com wss://*.jivosite.com",
              "frame-src 'self' https://*.jivosite.com",
              "object-src 'none'",
              "frame-ancestors 'self'",
            ].join('; ')
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig
