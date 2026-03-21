import { register } from 'react-native-bundle-splitter';

export const LazyFilterScreen = register({
  loader: () => import('./FilterScreen'),
});
