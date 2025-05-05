import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    basePath: process.env.NODE_ENV === 'development' ? '' : '/edihub', // Ajusta esto al nombre de tu subaplicación en IIS
    images: {
        domains: ['localhost'],
    },
    env: {
        development: "https://localhost:7205/api",
        production: "/api", // Esto se ajustará según tu configuración de proxy en IIS
        HEADER_TOKEN: "xtoken"
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                fs: false,
                module: false,
            }
        }
        return config
    }
};

export default withNextIntl(nextConfig); 