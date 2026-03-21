import { register } from 'react-native-bundle-splitter';

export const LazyConnectEmailSuccessScreen = register({
  loader: () => import('./ConnectEmailSuccessScreen'),
});
