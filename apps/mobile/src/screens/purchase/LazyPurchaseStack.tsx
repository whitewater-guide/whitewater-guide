import { register } from 'react-native-bundle-splitter';

export const LazyPurchaseStack = register({
  loader: () => import('./PurchaseStack'),
});
