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
}

module.exports = nextConfig
