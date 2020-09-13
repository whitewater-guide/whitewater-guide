import { register } from 'react-native-bundle-splitter';

export const LazyWelcomeScreen = register({
  require: () => require('./WelcomeScreen'),
});
