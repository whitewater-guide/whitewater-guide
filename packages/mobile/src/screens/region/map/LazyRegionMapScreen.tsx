import { register } from 'react-native-bundle-splitter';

export const LazyRegionMapScreen = register({
  require: () => require('./RegionMapScreen'),
});
