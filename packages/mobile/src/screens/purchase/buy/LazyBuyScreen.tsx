import { register } from 'react-native-bundle-splitter';

export const LazyBuyScreen = register({
  require: () => require('./BuyScreen'),
});
