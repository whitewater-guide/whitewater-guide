import { register } from 'react-native-bundle-splitter';

export const LazyWebViewScreen = register({
  require: () => require('./WebViewScreen'),
});
