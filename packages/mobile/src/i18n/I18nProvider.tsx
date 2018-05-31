import i18next from 'i18next';
import moment from 'moment';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import RNLanguages from 'react-native-languages';
import { MyProfileConsumer } from '../ww-clients/features/users';
import { SUPPORTED_LANGUAGES } from './languages';
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
    this.i18n = i18next.init({
      lng: (language).substr(0, 2),
      fallbackLng: 'en',
      whitelist: SUPPORTED_LANGUAGES,
      interpolation: {
        escapeValue: false, // not needed for react!!
      },
      react: {
        nsMode: 'fallback',
      },
      resources: { en, ru },
    });
    moment.locale(this.i18n.languages[0]);
    this.i18n.on('languageChanged', this.onLanguageChange);
  }

  componentWillUnmount() {
    this.i18n.off('languageChanged', this.onLanguageChange);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.language !== nextProps.language) {
      const language = (nextProps.language || RNLanguages.language || 'en').substr(0, 2);
      this.i18n.changeLanguage(language);
    }
  }

  onLanguageChange = (language: string) => {
    if (language) {
      moment.locale(this.i18n.languages[0]);
    }
  };

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
    {({ me }) => (
      <I18nProviderInternal language={me ? me.language : undefined}>
        {children}
      </I18nProviderInternal>
    )}
  </MyProfileConsumer>
);
