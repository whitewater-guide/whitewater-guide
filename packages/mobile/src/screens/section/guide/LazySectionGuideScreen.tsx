import { register } from 'react-native-bundle-splitter';

export const LazySectionGuideScreen = register({
  loader: () => import('./SectionGuideScreen'),
});
