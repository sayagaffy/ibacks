import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.ibackscreation.com",
      },
      {
        protocol: "https",
        hostname: "assets-alpha.ass8c.upcloudobjects.com",
      },
      {
        protocol: "https",
        hostname: "file-service.3smqg.upcloudobjects.com",
      },
      {
        protocol: "https",
        hostname: "cf.shopee.co.id",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
