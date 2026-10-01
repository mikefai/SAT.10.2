import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json exists higher up the tree; pin the project root explicitly.
  turbopack: { root: process.cwd() },
};

export default nextConfig;
