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
};

export default nextConfig;
