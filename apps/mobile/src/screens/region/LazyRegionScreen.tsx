import { register } from 'react-native-bundle-splitter';

export const LazyRegionScreen = register({
  loader: () => import('./RegionScreen'),
});

LazyRegionScreen.displayName = 'LazyRegionScreen';
