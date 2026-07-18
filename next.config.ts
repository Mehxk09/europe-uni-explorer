import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  outputFileTracingIncludes: {
    "/": ["./data/euro-uni.db"],
    "/countries/[code]": ["./data/euro-uni.db"],
    "/search": ["./data/euro-uni.db"],
    "/compare": ["./data/euro-uni.db"],
    "/universities/[id]": ["./data/euro-uni.db"],
    "/api/universities": ["./data/euro-uni.db"],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
