import { register } from 'react-native-bundle-splitter';

export const LazyFilterScreen = register({
  require: () => require('./FilterScreen'),
});
