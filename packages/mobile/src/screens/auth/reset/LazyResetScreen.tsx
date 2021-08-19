import { register } from 'react-native-bundle-splitter';

export const LazyResetScreen = register({
  loader: () => import('./ResetScreen'),
});
