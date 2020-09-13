import { register } from 'react-native-bundle-splitter';

export const LazyMyProfileScreen = register({
  require: () => require('./MyProfileScreen'),
});
