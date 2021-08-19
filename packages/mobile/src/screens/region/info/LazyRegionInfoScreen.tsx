import { register } from 'react-native-bundle-splitter';

export const LazyRegionInfoScreen = register({
  loader: () => import('./RegionInfoScreen'),
});
