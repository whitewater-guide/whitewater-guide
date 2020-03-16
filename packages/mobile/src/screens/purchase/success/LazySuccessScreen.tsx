import { register } from 'react-native-bundle-splitter';

export const LazySuccessScreen = register({
  require: () => require('./SuccessScreen'),
});
