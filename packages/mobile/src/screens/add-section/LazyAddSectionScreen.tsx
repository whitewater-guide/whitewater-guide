import { register } from 'react-native-bundle-splitter';

export const LazyAddSectionScreen = register({
  loader: () => import('./AddSectionScreen'),
});

LazyAddSectionScreen.displayName = 'LazyAddSectionScreen';
