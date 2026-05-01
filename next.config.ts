import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ["@react-three/fiber", "@react-three/drei"],
  },
};

export default nextConfig;
