import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
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

export default withNextIntl(config); 