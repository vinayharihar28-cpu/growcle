import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  serverExternalPackages: ["ioredis", "bullmq", "bcrypt"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
