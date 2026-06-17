import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The project's own pnpm-workspace.yaml is the workspace root.
  turbopack: {
    root: __dirname,
  },
  // Emit a self-contained server (.next/standalone) so the Docker runtime
  // image can run `node server.js` without installing node_modules.
  output: "standalone",
  // Trace from this directory; the pnpm-workspace.yaml here marks the root.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
