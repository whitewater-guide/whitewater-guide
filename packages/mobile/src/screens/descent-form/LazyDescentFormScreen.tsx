import { register } from 'react-native-bundle-splitter';

export const LazyDescentFormScreen = register({
  loader: () => import('./DescentFormScreen'),
});
