import { register } from 'react-native-bundle-splitter';

export const LazyGaugeScreen = register({
  loader: () => import('./GaugeScreen'),
});
