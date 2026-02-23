import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  headers: async () => [
    {
      // All pages: short CDN cache so deploys are picked up quickly
      source: "/:path*",
      headers: [
        {
          key: "CDN-Cache-Control",
          value: "max-age=60, stale-while-revalidate=300",
        },
      ],
    },
  ],
};

export default nextConfig;
