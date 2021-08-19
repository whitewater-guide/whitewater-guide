import { register } from 'react-native-bundle-splitter';

export const LazySectionScreen = register({
  loader: () => import('./SectionScreen'),
});

LazySectionScreen.displayName = 'LazySectionScreen';
