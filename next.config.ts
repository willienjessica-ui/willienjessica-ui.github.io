// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",        // enables static export to /out
  images: { unoptimized: true },
};

export default nextConfig;
