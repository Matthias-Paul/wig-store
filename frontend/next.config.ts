import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

    const rewrites = [
      {
        source: "/__/auth/:path*",
        destination: `https://${firebaseAuthHost}/__/auth/:path*`,
      },
    ];

    // Local-only proxy so /api/v1 hits Nest on :4000 during development
    if (process.env.NODE_ENV === "development") {
      rewrites.push({
        source: "/api/v1/:path*",
        destination: "http://localhost:4000/api/v1/:path*",
      });
    }

    return rewrites;
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
