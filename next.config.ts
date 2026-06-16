import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The project's own pnpm-workspace.yaml is the workspace root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
