import type { NextConfig } from "next";

const API_BASE_URL = process.env.API_BASE_URL?.trim().replace(/\/+$/, "");

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  async rewrites() {
    return {
      beforeFiles: API_BASE_URL ? [{ source: "/api/:path*", destination: `${API_BASE_URL}/api/:path*` }] : [],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
