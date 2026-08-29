import 'intl-pluralrules';

import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import {
  resources,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from './i18n-resources';

function isSupportedLanguage(code: string): code is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(code);
}

function detectLanguage(): SupportedLanguage {
  const code = getLocales()[0]?.languageCode ?? 'en';
  return isSupportedLanguage(code) ? code : 'en';
}

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: detectLanguage(),
  fallbackLng: 'en',
  supportedLngs: [...SUPPORTED_LANGUAGES],
  resources,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  initImmediate: false,
});

export { i18n };
export { LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from './i18n-resources';
export type { SupportedLanguage } from './i18n-resources';
