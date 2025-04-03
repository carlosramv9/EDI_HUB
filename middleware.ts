import createMiddleware from 'next-intl/middleware';
import { locales } from './src/i18n/config';

export default createMiddleware({
  // Una lista de todos los locales que soporta tu aplicación
  locales: ['es', 'en'],
  
  // Si este locale no está en la lista de locales, se usará el defaultLocale
  defaultLocale: 'es',
  
  // Si es true, agregará el locale al path (/es/blog)
  localePrefix: 'always',
  
  // Páginas que no necesitan localización
  localeDetection: true,
  
  // Función para determinar si una ruta debe ser localizada
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

export const config = {
  // Matcher para las rutas que deben ser manejadas por el middleware
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 