/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/urbanwood/**",
      },
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/urbanwood/**",
      },
    ],
    domains: [
      "localhost",
      "console-production-d887.up.railway.app",
      `bucket-production-ef6b.up.railway.app`,
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
};

export default withNextIntl(nextConfig);
