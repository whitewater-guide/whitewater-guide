import { register } from 'react-native-bundle-splitter';

export const LazyLogbookScreen = register({
  loader: () => import('./LogbookScreen'),
});
