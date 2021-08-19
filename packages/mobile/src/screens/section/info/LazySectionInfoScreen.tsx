import { register } from 'react-native-bundle-splitter';

export const LazySectionInfoScreen = register({
  loader: () => import('./SectionInfoScreen'),
});
