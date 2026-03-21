import { register } from 'react-native-bundle-splitter';

export const LazyConnectEmailScreen = register({
  loader: () => import('./ConnectEmailScreen'),
});
