import { useAuth } from '@whitewater-guide/clients';
import i18next from 'i18next';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import * as yup from 'yup';
import { SUPPORTED_LANGUAGES } from './languages';
import resources from './resources';
import yupLocale from './yup-locale';

interface OuterProps {
  onLanguageChange?: (language: string) => void;
}

const _i18n = i18next.use(initReactI18next);

export const I18nProvider: React.FC<OuterProps> = ({
  onLanguageChange,
  children,
}) => {
  const [ready, setReady] = useState(false);
  const { me } = useAuth();

  const handleLanguageChange = useCallback(
    (language: string) => {
      if (!language) {
        return;
      }
      moment.locale(_i18n.languages[0]);
      if (onLanguageChange) {
        onLanguageChange(language);
      }
    },
    [onLanguageChange],
  );

  useEffect(() => {
    const onMount = async () => {
      yup.setLocale(yupLocale);
      const [{ languageCode }] = getLocales();
      const language = (me && me.language) || languageCode || 'en';
      const lng = language.substr(0, 2);
      await _i18n.init({
        lng,
        fallbackLng: 'en',
        whitelist: SUPPORTED_LANGUAGES,
        interpolation: {
          escapeValue: false, // not needed for react!!
          format: (value, format) => {
            if (format === 'month') {
              return moment()
                .month(value)
                .format('DD MMMM')
                .split(' ')[1];
            }
            return value;
          },
        },
        react: {
          nsMode: 'fallback',
        },
        resources,
      });
      moment.locale(_i18n.languages[0]);
      _i18n.on('languageChanged', handleLanguageChange);
      setReady(true);
      return;
    };

    onMount();

    return () => {
      _i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    const [{ languageCode }] = getLocales();
    const language = ((me && me.language) || languageCode || 'en').substr(0, 2);
    _i18n.changeLanguage(language);
  }, [me && me.language]);

  return (ready ? children : null) as any;
};

I18nProvider.displayName = 'I18nProvider';
