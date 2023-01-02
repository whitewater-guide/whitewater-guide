import { register } from 'react-native-bundle-splitter';

export const LazySocialScreen = register({
  loader: () => import('./AuthSocialScreen'),
});
