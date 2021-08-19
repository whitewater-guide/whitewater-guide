import { register } from 'react-native-bundle-splitter';

export const LazyAttributesScreen = register({
  loader: () => import('./AttributesScreen'),
});
