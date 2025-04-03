import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Valida que el locale solicitado esté soportado
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: 'America/Mexico_City',
    now: new Date(),
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        },
        long: {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          timeZoneName: 'short'
        }
      },
      number: {
        currency: {
          style: 'currency',
          currency: 'MXN'
        },
        percent: {
          style: 'percent',
          minimumFractionDigits: 2
        }
      }
    },
    defaultTranslationValues: {
      appName: 'EDIHub',
      company: 'Tu Empresa'
    }
  };
}); 