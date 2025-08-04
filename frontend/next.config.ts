import type { NextConfig } from 'next';
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = withBundleAnalyzer({
  compiler: {
    styledComponents: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: true,

  experimental: {
    legacyBrowsers: false,
    nextScriptWorkers: true, // helps serve modern chunks
    instrumentationHook: false // disables next-devtools injection
  },
});

export default nextConfig;
