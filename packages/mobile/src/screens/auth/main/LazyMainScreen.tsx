import { register } from 'react-native-bundle-splitter';

export const LazyMainScreen = register({
  require: () => require('./AuthMainScreen'),
});
