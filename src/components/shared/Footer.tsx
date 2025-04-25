'use client'
import React from 'react'
import { useLanguage } from '@/hooks/useLanguage'

type TranslationKey = 'copyright';

type Translations = {
  [key in TranslationKey]: string;
};

const Footer = () => {
  const { isSpanish } = useLanguage()
  const currentYear = new Date().getFullYear()

  const t = (key: TranslationKey) => {
    return isSpanish ? translations.es[key] : translations.en[key];
  }

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Copyright */}
        <div className="border-t border-gray-200 py-4">
          <p className="text-sm text-gray-600 text-center">
            © {currentYear} EDIHub. {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}

const translations: Record<'es' | 'en', Translations> = {
  es: {
    copyright: 'Todos los derechos reservados.'
  },
  en: {
    copyright: 'All rights reserved.'
  }
}

export default Footer