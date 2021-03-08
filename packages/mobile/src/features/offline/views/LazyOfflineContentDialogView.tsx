import { register } from 'react-native-bundle-splitter';

import Loading from '~/components/Loading';

export default register({
  require: () => require('./OfflineContentDialogView'),
  placeholder: Loading,
} as any);
