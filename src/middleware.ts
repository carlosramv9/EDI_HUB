import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/config';

export default async function middleware(request: NextRequest) {
    // Step 1: Use the incoming request (example)
    const defaultLocale = request.headers.get('x-your-custom-locale') || 'en';

    // Step 2: Create and call the next-intl middleware (example)
    const handleI18nRouting = createMiddleware({
        locales,
        defaultLocale: 'es',
        localePrefix: 'as-needed',
        localeDetection: false,
        pathnames: {
            '/dashboard': {
                es: '/panel',
                en: '/dashboard',
            },
            '/about': {
                es: '/sobre-nosotros',
                en: '/about',
            },
        },
    });
    const response = handleI18nRouting(request);

    // Step 3: Alter the response (example)
    response.headers.set('x-your-custom-locale', defaultLocale);

    return response;
}


export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)', '/(en|es)/:path*'],
};

