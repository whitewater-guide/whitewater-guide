import { register } from 'react-native-bundle-splitter';

export const LazyDescriptionScreen = register({
  loader: () => import('./DescriptionScreen'),
});
