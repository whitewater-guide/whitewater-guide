import { register } from 'react-native-bundle-splitter';

export const LazySectionChartScreen = register({
  loader: () => import('./SectionChartScreen'),
});
