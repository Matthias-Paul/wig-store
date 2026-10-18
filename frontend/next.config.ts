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

    // Browser calls same-origin /api/v1 → Nest (avoids third-party cookies on iOS)
    const apiProxyTarget =
      process.env.API_PROXY_TARGET ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:4000"
        : "https://api.rockshairmpire.com");

    return [
      {
        source: "/__/auth/:path*",
        destination: `https://${firebaseAuthHost}/__/auth/:path*`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${apiProxyTarget.replace(/\/$/, "")}/api/v1/:path*`,
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
