import { register } from 'react-native-bundle-splitter';

export const LazyAuthStack = register({
  require: () => require('./AuthStack'),
});
