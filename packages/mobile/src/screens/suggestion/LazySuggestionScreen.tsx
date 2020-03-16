import { register } from 'react-native-bundle-splitter';

export const LazySuggestionScreen = register({
  require: () => require('./SuggestionScreen'),
});
