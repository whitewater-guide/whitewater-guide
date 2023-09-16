import { register } from 'react-native-bundle-splitter';

import Loading from '~/components/Loading';

import type { OfflineContentDialogViewProps } from './OfflineContentDialogView';

export default register<OfflineContentDialogViewProps>({
  loader: () => import('./OfflineContentDialogView'),
  placeholder: Loading,
});
