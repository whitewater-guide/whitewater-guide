import { register } from 'react-native-bundle-splitter';

export const LazyVerifyScreen = register({
  require: () => require('./VerifyScreen'),
});
