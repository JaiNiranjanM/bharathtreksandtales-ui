import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Trip photos uploaded from the admin panel (Firebase Storage).
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
  // firebase-admin and mammoth are Node-only; keep them out of the bundler.
  serverExternalPackages: ["firebase-admin", "mammoth"],
};

export default nextConfig;
