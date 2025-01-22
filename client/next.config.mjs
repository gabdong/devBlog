/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    REACT_APP_SERVER_URL: process.env.REACT_APP_SERVER_URL,
  },
  transpilePackages: ['@uiw/react-md-editor'],
  experimental: { esmExternals: true },
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  async rewrites() {
    return [
      {
        source: '/apis/:path*',
        destination: `${process.env.REACT_APP_SERVER_URL}/lib/apis/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gabdong.s3.ap-northeast-2.amazonaws.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
