import { register } from 'react-native-bundle-splitter';

export const LazyRegionSectionsListScreen = register({
  loader: () => import('./RegionSectionsListScreen'),
});
