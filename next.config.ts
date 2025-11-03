import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/@:username/:path*",
        destination: "/:username/:path*",
      },
    ];
  },
};

export default nextConfig;
