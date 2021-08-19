import { register } from 'react-native-bundle-splitter';

import Loading from '~/components/Loading';

export default register({
  loader: () => import('./OfflineContentDialogView'),
  placeholder: Loading,
});
