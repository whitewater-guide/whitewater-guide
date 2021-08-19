import { register } from 'react-native-bundle-splitter';

export const LazyPhotosScreen = register({
  loader: () => import('./PhotosScreen'),
});
