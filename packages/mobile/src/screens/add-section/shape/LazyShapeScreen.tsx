import { register } from 'react-native-bundle-splitter';

export const LazyShapeScreen = register({
  loader: () => import('./ShapeScreen'),
});
