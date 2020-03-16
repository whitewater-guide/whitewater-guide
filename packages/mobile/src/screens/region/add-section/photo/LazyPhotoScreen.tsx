import { register } from 'react-native-bundle-splitter';

export const LazyPhotoScreen = register({
  require: () => require('./PhotoScreen'),
});
