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
  }
};

export default nextConfig;
