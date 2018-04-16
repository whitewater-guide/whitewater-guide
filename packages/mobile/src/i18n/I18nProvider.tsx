import i18next from 'i18next';
import mapValues from 'lodash/mapValues';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import RNLanguages from 'react-native-languages';
import { MyProfileConsumer } from '../ww-clients/features/users';
import { LANGUAGES } from '../ww-commons/core';
import { User } from '../ww-commons/features/users';
import flattenLocales from './flattenLocales';
import en from './locales/en';
import ru from './locales/ru';

interface Props {
  language?: string;
}

export class I18nProviderInternal extends React.PureComponent<Props> {
  i18n: i18next.i18n;

  constructor(props: Props) {
    super(props);
    const resources = {
      en: mapValues(en, (v: any) => flattenLocales(v)) as any,
      ru: mapValues(ru, (v: any) => flattenLocales(v)) as any,
    };
    this.i18n = i18next.init({
      lng: (props.language || RNLanguages.language || 'en').substr(0, 2),
      fallbackLng: 'en',
      whitelist: LANGUAGES,
      interpolation: {
        escapeValue: false, // not needed for react!!
      },
      react: {
        nsMode: 'fallback',
      },
      resources,
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.language !== nextProps.language) {
      this.i18n.changeLanguage(nextProps.language);
    }
  }

  render() {
    return (
      <I18nextProvider i18n={this.i18n}>
        {this.props.children as any}
      </I18nextProvider>
    );
  }
}

export const I18nProvider: React.StatelessComponent = ({ children }) => (
  <MyProfileConsumer>
    {(me: User | null) => (
      <I18nProviderInternal language={me ? me.language : undefined}>
        {children}
      </I18nProviderInternal>
    )}
  </MyProfileConsumer>
);
