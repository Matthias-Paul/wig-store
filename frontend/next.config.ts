import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Shared hosting (cPanel) has low process/thread limits; Next defaults spawn too many workers.
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
  async rewrites() {
    const firebaseAuthHost =
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
      "rocks-hairmpire.firebaseapp.com";

    // /api/v1/* is handled by app/api/v1/[...path]/route.ts (more reliable than
    // external rewrites on cPanel/Passenger — preserves cookies & response bodies).
    return [
      {
        source: "/__/auth/:path*",
        destination: `https://${firebaseAuthHost}/__/auth/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
