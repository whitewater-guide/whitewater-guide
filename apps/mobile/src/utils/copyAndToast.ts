import Clipboard from '@react-native-clipboard/clipboard';

import showSnackbarMessage from '~/components/showSnackbarMessage';

export default function copyAndToast(value: string) {
  Clipboard.setString(value);
  showSnackbarMessage('commons:copied');
}
