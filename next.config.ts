import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Anchor module resolution to this project so a stray lockfile in a parent
  // directory can't confuse Turbopack's workspace-root detection.
  turbopack: { root: __dirname },
};

export default nextConfig;
