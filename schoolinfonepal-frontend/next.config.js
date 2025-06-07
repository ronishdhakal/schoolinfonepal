/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "localhost",
      "127.0.0.1",
      "your-backend-domain.com", // Replace with your actual backend domain
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "your-backend-domain.com", // Replace with your actual backend domain
        pathname: "/media/**",
      },
    ],
    unoptimized: true,
  },
}

module.exports = nextConfig
