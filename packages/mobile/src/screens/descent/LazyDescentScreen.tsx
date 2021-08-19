import { register } from 'react-native-bundle-splitter';

export const LazyDescentScreen = register({
  loader: () => import('./DescentScreen'),
});
