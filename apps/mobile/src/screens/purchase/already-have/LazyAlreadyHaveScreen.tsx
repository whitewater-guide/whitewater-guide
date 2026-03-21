import { register } from 'react-native-bundle-splitter';

export const LazyAlreadyHaveScreen = register({
  loader: () => import('./AlreadyHaveScreen'),
});
