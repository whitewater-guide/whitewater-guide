import i18n from 'i18next';
import React from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'cimode',
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});

export const I18nTestProvider: React.FC = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);
