import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Figma Make serves the local dev server through a generated preview subdomain.
  allowedDevOrigins: ["**.figma.site"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-**" }],
  },
};

export default nextConfig;
