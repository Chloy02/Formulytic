import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  // Ensure Next.js looks in the src directory
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default nextConfig;
