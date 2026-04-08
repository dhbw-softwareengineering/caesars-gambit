import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.BUILD_STANDALONE === '1' ? 'standalone' : undefined,
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
};

export default nextConfig;
