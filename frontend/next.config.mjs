/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "mammoth"],
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  swcMinify: false,
};

export default nextConfig;