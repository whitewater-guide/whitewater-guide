import Loading from 'components/Loading';
import { register } from 'react-native-bundle-splitter';

export default register({
  require: () => require('./OfflineContentDialogView'),
  placeholder: Loading,
} as any);
