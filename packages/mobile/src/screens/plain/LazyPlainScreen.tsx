// tslint:disable-next-line:no-submodule-imports
import { register } from 'react-native-bundle-splitter';

export const LazyPlainScreen = register({
  require: () => require('./PlainTextScreen'),
});
