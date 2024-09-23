/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@ts-morph"],
  },
};

export default nextConfig;
