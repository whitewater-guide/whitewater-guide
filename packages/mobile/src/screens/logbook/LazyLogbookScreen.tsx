import { register } from 'react-native-bundle-splitter';

export const LazyLogbookScreen = register({
  require: () => require('./LogbookScreen'),
});
