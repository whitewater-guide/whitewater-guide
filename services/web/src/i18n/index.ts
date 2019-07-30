import { web } from '@whitewater-guide/translations';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  whitelist: ['en', 'ru'],
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
  react: {
    nsMode: 'fallback',
  },
  resources: web,
});

export default i18n;
