import { register } from 'react-native-bundle-splitter';

export const LazySectionMapScreen = register({
  loader: () => import('./SectionMapScreen'),
});
