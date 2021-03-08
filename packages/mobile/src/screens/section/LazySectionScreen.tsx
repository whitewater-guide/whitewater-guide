import { register } from 'react-native-bundle-splitter';

export const LazySectionScreen = register({
  require: () => require('./SectionScreen'),
});

LazySectionScreen.displayName = 'LazySectionScreen';
