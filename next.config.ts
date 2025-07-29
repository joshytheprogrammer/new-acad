import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/api/portraits/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // Add trailing slash for consistency
  trailingSlash: false,
  // Optimize for academy site
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
