import i18next from 'i18next';
import moment from 'moment';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import RNLanguages from 'react-native-languages';
import { MyProfileConsumer } from '../ww-clients/features/users';
import { LANGUAGES } from '../ww-commons/core';
import { User } from '../ww-commons/features/users';
import en from './locales/en';
import ru from './locales/ru';

interface Props {
  language?: string;
}

export class I18nProviderInternal extends React.PureComponent<Props> {
  i18n: i18next.i18n;

  constructor(props: Props) {
    super(props);
    const language = props.language || RNLanguages.language || 'en';
    moment.locale(language);
    this.i18n = i18next.init({
      lng: (language).substr(0, 2),
      fallbackLng: 'en',
      whitelist: LANGUAGES,
      interpolation: {
        escapeValue: false, // not needed for react!!
      },
      react: {
        nsMode: 'fallback',
      },
      resources: { en, ru },
    });
    this.i18n.on('languageChanged', this.onLanguageChange);
  }

  componentWillUnmount() {
    this.i18n.off('languageChanged', this.onLanguageChange);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.language !== nextProps.language) {
      this.i18n.changeLanguage(nextProps.language);
    }
  }

  onLanguageChange = (language: string) => moment.locale(language);

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
