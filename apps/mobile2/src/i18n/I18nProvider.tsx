import 'intl-pluralrules';

import { useApolloClient } from '@apollo/client';
import { configDateFNS } from '@whitewater-guide/clients';
import i18next from 'i18next';
import type { FC, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';

import formatters from './formatters';
import { SUPPORTED_LANGUAGES } from './languages';
import resources from './resources';

export const i18n = i18next.use(initReactI18next);

export const I18nProvider: FC<PropsWithChildren> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const apolloClient = useApolloClient();

  useEffect(() => {
    const onMount = async () => {
      const [{ languageCode }] = getLocales();
      const lng = (languageCode ?? 'en').substring(0, 2);
      await i18n.init({
        compatibilityJSON: 'v4',
        lng,
        fallbackLng: 'en',
        supportedLngs: SUPPORTED_LANGUAGES,
        interpolation: {
          escapeValue: false,
          format: (value, format) => {
            if (format && formatters[format]) {
              return formatters[format](value, format);
            }
            return value;
          },
        },
        resources,
        appendNamespaceToCIMode: true,
      });
      configDateFNS(i18n.languages[0]);
      setReady(true);
    };

    onMount();
  }, []);

  useEffect(() => {
    const handleLanguageChanged = () => {
      apolloClient.resetStore().catch(() => {
        // ignore reset errors — app will retry on next network request
      });
    };
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [apolloClient]);

  return (ready ? children : null) as any;
};

I18nProvider.displayName = 'I18nProvider';
