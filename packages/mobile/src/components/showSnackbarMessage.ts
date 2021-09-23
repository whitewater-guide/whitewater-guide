import Snackbar from 'react-native-snackbar';

import { i18n } from '~/i18n';

export default function showSnackbarMessage(i18nKey?: string | null) {
  if (!i18nKey) {
    return;
  }
  Snackbar.show({
    text: i18n.t(i18nKey),
    duration: Snackbar.LENGTH_SHORT,
  });
}
