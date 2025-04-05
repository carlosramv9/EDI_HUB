'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { locales, type Locale } from '@/i18n/config';

export const useLanguage = () => {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const currentIndex = locales.indexOf(locale);
    const nextIndex = (currentIndex + 1) % locales.length;
    const newLocale = locales[nextIndex];

    router.replace(pathname, { locale: newLocale });
  };

  return {
    currentLocale: locale,
    toggleLanguage,
    isSpanish: locale === 'es'
  };
};