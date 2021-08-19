import { register } from 'react-native-bundle-splitter';

export const LazyMainScreen = register({
  loader: () => import('./MainScreen'),
});
