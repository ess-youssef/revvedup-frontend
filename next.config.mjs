/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_API_HOSTNAME,
        pathname: '/storage/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true
  },
  output: 'export',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
