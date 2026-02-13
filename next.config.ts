import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "data.crea.ca", pathname: "/**" },
      { protocol: "https", hostname: "**.crea.ca", pathname: "/**" },
      { protocol: "https", hostname: "ddfcdn.realtor.ca", pathname: "/**" },
    ],
  },
};

export default nextConfig;
