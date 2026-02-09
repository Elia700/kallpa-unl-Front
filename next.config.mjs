import path from "path";

/** @type {import("next").NextConfig} */
const nextConfig = {
  // 🏗️ Build Configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // ⚡ Production Optimizations
  poweredByHeader: false,
  generateEtags: false,
  compress: true,

  // 🌐 Azure App Service Support
  output: process.env.NEXT_OUTPUT_STANDALONE === 'true' ? 'standalone' : undefined,

  // 🔧 Webpack Configuration for Alias Support
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(process.cwd(), "src");
    return config;
  },

  // 🖼️ Image Optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: ""
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
        port: ""
      },
      {
        protocol: "https",
        hostname: "kallpa-backend-app-h7dad0fnghd9bjhs.westus3-01.azurewebsites.net",
        port: ""
      }
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24 hours
  },

  // 🛡️ Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // 🗜️ Compression is now built-in for Next.js 15+
  
  // 📦 Bundle Analysis (uncomment for debugging)
  // bundlePagesRouterDependencies: true,
  
  // 🔧 Experimental Features - minimal config for stability
  experimental: {
    // Only use features that are stable in Next.js 15
  },
};

export default nextConfig;
