import RNI18n from 'react-native-i18n';
import en from './locales/en';
import ru from './locales/ru';

// This reassignment is only for better code completion in ide
const I18n = RNI18n;

I18n.fallbacks = true;

I18n.translations = {
  en,
  ru,
};

export default I18n;
