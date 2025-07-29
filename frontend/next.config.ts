import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Railway deployment optimizations
  output: 'standalone',
  
  // API rewrites for production
  async rewrites() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/api/:path*',
          destination: '/api/:path*' // Proxy to same domain
        }
      ];
    }
    return [];
  },
  
  // Image optimization
  images: {
    unoptimized: true,
    domains: []
  },
  
  // Static export settings
  trailingSlash: true,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? '/api' 
      : 'http://localhost:5000/api'
  }
};

export default nextConfig;
