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
  env: {
    // development: "http://localhost:5116",
    development: "http://yarzaycia.dyndns.org:8084/server",
    // production: "http://localhost:5116",
    production: "http://yarzaycia.dyndns.org:8084/server",
    ACCESS_TOKEN: "accessToken",
    VER: '0.11.1'
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  }
};

export default withNextIntl(config); 