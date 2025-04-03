import { useState, useEffect } from 'react';
import { locales, type Locale } from '@/i18n/config';

const LANGUAGE_KEY = 'preferred_language';

export const useLanguage = () => {
  const [currentLocale, setCurrentLocale] = useState<Locale>('es');

  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY) as Locale;
    if (savedLanguage && locales.includes(savedLanguage)) {
      setCurrentLocale(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const currentIndex = locales.indexOf(currentLocale);
    const nextIndex = (currentIndex + 1) % locales.length;
    const newLocale = locales[nextIndex];
    
    localStorage.setItem(LANGUAGE_KEY, newLocale);
    setCurrentLocale(newLocale);
    window.location.reload(); // Recarga la página para aplicar el nuevo idioma
  };

  return {
    currentLocale,
    toggleLanguage,
    isSpanish: currentLocale === 'es'
  };
}; 