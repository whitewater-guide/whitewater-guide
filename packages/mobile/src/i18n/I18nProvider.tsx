import { configDateFNS, useAuth } from '@whitewater-guide/clients';
import type { MyProfileFragment } from '@whitewater-guide/schema';
import i18next from 'i18next';
import type { FC, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import Config from 'react-native-ultimate-config';

import { usePrevious } from '../utils/usePrevious';
import formatters from './formatters';
import { SUPPORTED_LANGUAGES } from './languages';
import resources from './resources';

interface Props {
  /**
   * This is called when user changes language explicitly
   * This is not called when user logs in or logs out
   * @param language
   */
  onUserLanguageChange?: (language: string) => void;
}

export const i18n = i18next.use(initReactI18next);

const getMyLanguage = (me?: MyProfileFragment | null) => {
  const [{ languageCode }] = getLocales();
  return (me?.language ?? languageCode ?? 'en').substr(0, 2);
};

export const I18nProvider: FC<PropsWithChildren<Props>> = ({
  onUserLanguageChange,
  children,
}) => {
  const [ready, setReady] = useState(false);
  const { me } = useAuth();
  const prevMe = usePrevious(me);

  useEffect(() => {
    const onMount = async () => {
      const [{ languageCode }] = getLocales();
      const language = me?.language ?? languageCode ?? 'en';
      const lng = Config.E2E_MODE === 'true' ? 'cimode' : language.substr(0, 2);
      await i18n.init({
        compatibilityJSON: 'v3',
        lng,
        fallbackLng: 'en',
        supportedLngs: SUPPORTED_LANGUAGES,
        interpolation: {
          escapeValue: false, // not needed for react!!
          format: (value, format) => {
            if (format && formatters[format]) {
              return formatters[format](value, format);
            }
            return value;
          },
        },
        react: {
          nsMode: 'fallback',
        },
        resources,
        appendNamespaceToCIMode: true,
      });
      const dfnsLng = Config.E2E_MODE === 'true' ? 'en' : i18n.languages[0];
      configDateFNS(dfnsLng);
      setReady(true);
    };

    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const prevLang = getMyLanguage(prevMe);
    const language = getMyLanguage(me);
    if (language === prevLang) {
      return;
    }
    i18next.changeLanguage(language).then(() => {
      configDateFNS(i18n.languages[0]);
    });
    // should not fire on login or logout, only on change
    if (onUserLanguageChange && !!me && !!prevMe) {
      onUserLanguageChange(language);
    }
  }, [me, prevMe, onUserLanguageChange]);

  return (ready ? children : null) as any;
};

I18nProvider.displayName = 'I18nProvider';
