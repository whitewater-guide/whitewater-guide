import { register } from 'react-native-bundle-splitter';

export const LazyRegionScreen = register({
  require: () => require('./RegionScreen'),
});

LazyRegionScreen.displayName = 'LazyRegionScreen';
