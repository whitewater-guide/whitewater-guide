import { register } from 'react-native-bundle-splitter';

export const LazyShapeScreen = register({
  require: () => require('./ShapeScreen'),
});
