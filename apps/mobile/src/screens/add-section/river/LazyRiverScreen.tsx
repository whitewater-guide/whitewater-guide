import { register } from 'react-native-bundle-splitter';

export const LazyRiverScreen = register({
  loader: () => import('./RiverScreen'),
});
