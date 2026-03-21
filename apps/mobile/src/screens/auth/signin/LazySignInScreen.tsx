import { register } from 'react-native-bundle-splitter';

export const LazySignInScreen = register({
  loader: () => import('./SignInScreen'),
});
