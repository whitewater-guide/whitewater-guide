import { register } from 'react-native-bundle-splitter';

export const LazyVerifyScreen = register({
  loader: () => import('./VerifyScreen'),
});
