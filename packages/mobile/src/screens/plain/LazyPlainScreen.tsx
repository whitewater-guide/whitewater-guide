import { register } from 'react-native-bundle-splitter';

export const LazyPlainScreen = register({
  loader: () => import('./PlainTextScreen'),
});
