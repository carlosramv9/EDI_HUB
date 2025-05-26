import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/config';

export default async function middleware(request: NextRequest) {
    const defaultLocale = 'es';
    // Si estamos en la raíz, redirigir al locale por defecto
    if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/es/authenticate/login', request.url));
    }

    const handleI18nRouting = createMiddleware({
        locales,
        defaultLocale: 'es',
        localePrefix: 'as-needed',
        localeDetection: false,
        pathnames: {
        },
    });
    const response = handleI18nRouting(request);

    // Step 3: Alter the response (example)
    response.headers.set('x-your-custom-locale', defaultLocale);

    return response;
}


// export const config = {
//     matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)', '/(en|es)/:path*'],
// };
export const config = {
    matcher: [
        '/((?!api|_next|.*\\..*).*)',
        '/(en|es)/:path*'
    ],
};

