import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import resources from './resources';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    compatibilityJSON: 'v3',
    resources,
    supportedLngs: Object.keys(resources),
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      nsMode: 'fallback',
    },
    debug: process.env.NODE_ENV === 'development',
  });

export default i18n;
