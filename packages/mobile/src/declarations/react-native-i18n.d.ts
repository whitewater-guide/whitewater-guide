declare module 'react-native-i18n' {
  import * as I18n from 'i18n-js';

  export default I18n;

  export const getLanguages: () => Promise<string[]>;
}
