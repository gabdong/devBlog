/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  async rewrites() {
    return [
      {
        source: '/apis/:path*',
        destination: `${process.env.REACT_APP_SERVER_URL}/apis/:path*`,
      },
    ];
  },
};

export default nextConfig;
