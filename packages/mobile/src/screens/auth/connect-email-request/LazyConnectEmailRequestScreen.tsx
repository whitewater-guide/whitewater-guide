import { register } from 'react-native-bundle-splitter';

export const LazyConnectEmailRequestScreen = register({
  loader: () => import('./ConnectEmailRequestScreen'),
});
