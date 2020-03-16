import { register } from 'react-native-bundle-splitter';

export const LazyRegisterScreen = register({
  require: () => require('./RegisterScreen'),
});
