/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  sassOptions: {
    includePaths: ['./src/styles'],
    prependData: `@import "@/styles/variables.scss"; @import "@/styles/mixins.scss";`
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  }
};

export default nextConfig; 