import { register } from 'react-native-bundle-splitter';

export const LazySectionMediaScreen = register({
  require: () => require('./SectionMediaScreen'),
});
