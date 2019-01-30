import i18next from 'i18next';
import moment from 'moment';
import React from 'react';
import { reactI18nextModule } from 'react-i18next';
import RNLanguages from 'react-native-languages';
import { MyProfileConsumer } from '@whitewater-guide/clients';
import { SUPPORTED_LANGUAGES } from './languages';
import en from './locales/en';
import ru from './locales/ru';

interface Props {
  language?: string;
}

interface State {
  ready: boolean;
}

export class I18nProviderInternal extends React.PureComponent<Props, State> {
  readonly state: State = { ready: false };

  private _i18n: i18next.i18n = i18next.use(reactI18nextModule);

  async componentDidMount() {
    const language = this.props.language || RNLanguages.language || 'en';
    const lng = language.substr(0, 2);
    await this._i18n.init({
      lng,
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
    moment.locale(lng);
    this._i18n.on('languageChanged', this.onLanguageChange);
    this.setState({ ready: true });
  }

  componentWillUnmount() {
    this._i18n.off('languageChanged', this.onLanguageChange);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.language !== nextProps.language) {
      const language = (
        nextProps.language ||
        RNLanguages.language ||
        'en'
      ).substr(0, 2);
      this._i18n.changeLanguage(language);
    }
  }

  onLanguageChange = (language: string) => {
    if (language) {
      moment.locale(this._i18n.languages[0]);
    }
  };

  render() {
    return this.state.ready ? this.props.children : null;
  }
}

export const I18nProvider: React.FC = ({ children }) => (
  <MyProfileConsumer>
    {({ me }) => (
      <I18nProviderInternal language={me ? me.language : undefined}>
        {children}
      </I18nProviderInternal>
    )}
  </MyProfileConsumer>
);
