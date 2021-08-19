import { register } from 'react-native-bundle-splitter';

export const LazySectionMediaScreen = register({
  loader: () => import('./SectionMediaScreen'),
});
