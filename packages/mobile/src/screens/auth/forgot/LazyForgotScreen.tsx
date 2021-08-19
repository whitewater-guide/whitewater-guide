import { register } from 'react-native-bundle-splitter';

export const LazyForgotScreen = register({
  loader: () => import('./ForgotScreen'),
});
