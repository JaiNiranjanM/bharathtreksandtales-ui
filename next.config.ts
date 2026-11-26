import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `npm run dev` writes to its own folder so it can never wipe the production build in `.next`
  // (which would make `npm start` fail with "Could not find a production build").
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
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
