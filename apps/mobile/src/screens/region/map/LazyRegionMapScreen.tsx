import { register } from 'react-native-bundle-splitter';

export const LazyRegionMapScreen = register({
  loader: () => import('./RegionMapScreen'),
});
