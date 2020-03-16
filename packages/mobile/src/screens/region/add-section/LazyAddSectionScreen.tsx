import { register } from 'react-native-bundle-splitter';

export const LazyAddSectionScreen = register({
  require: () => require('./AddSectionScreen'),
});

LazyAddSectionScreen.displayName = 'LazyAddSectionScreen';
