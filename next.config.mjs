/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["localhost", "adwallpro.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/brands/**",
      },
      {
        protocol: "https",
        hostname: "adwallpro.com",
        pathname: "/brands/**",
      },
    ],
  },
};

export default nextConfig;
