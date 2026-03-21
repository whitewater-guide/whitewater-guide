import { register } from 'react-native-bundle-splitter';

export const LazyBuyScreen = register({
  loader: () => import('./BuyScreen'),
});
