import { configDateFNS } from '@whitewater-guide/clients';
import en from '@whitewater-guide/translations/web/en';
import ru from '@whitewater-guide/translations/web/ru';
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
  resources: { en, ru },
});
configDateFNS('en');

export default i18n;
