import { register } from 'react-native-bundle-splitter';

export const LazySuccessScreen = register({
  loader: () => import('./SuccessScreen'),
});
