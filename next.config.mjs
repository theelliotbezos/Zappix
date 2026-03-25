/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  // Ignore TypeScript errors during build for now (Phase 1 - foundation)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during build for now
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
