import NetInfo from '@react-native-community/netinfo';
import stringify from 'fast-json-stable-stringify';
import Snackbar from 'react-native-snackbar';

import { i18n } from '~/i18n';
import theme from '~/theme';
import copyAndToast from '~/utils/copyAndToast';

export default function showSnackbarError(
  error?: Error | string | null,
  showOfflineWarning = true,
) {
  if (!error) {
    return;
  }
  const canCopy = typeof error !== 'string';
  const i18nKey = canCopy ? 'errors:default' : error;
  let isInternetReachable: boolean | null = null;

  const isFetchError =
    typeof error === 'object' &&
    (error?.message === 'Network request failed' ||
      error?.message === 'form.fetch_error');

  NetInfo.fetch()
    .then((state) => {
      isInternetReachable = state.isInternetReachable;
    })
    .catch(() => {
      // do not care
    })
    .finally(() => {
      // Do not display error when internet is not reachable and error is network error
      // Just show offline message instead
      if (isInternetReachable === false && isFetchError) {
        Snackbar.show({
          text: i18n.t('commons:offline'),
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        let text = i18n.t(i18nKey);

        if (isInternetReachable === false && showOfflineWarning) {
          text = text + '\n' + i18n.t('commons:offline');
        }
        Snackbar.show({
          text,
          duration: Snackbar.LENGTH_LONG,
          action: canCopy
            ? {
                text: i18n.t('commons:copy'),
                textColor: theme.colors.accent,
                onPress: () => {
                  copyAndToast(stringify(error));
                  Snackbar.dismiss();
                },
              }
            : undefined,
        });
      }
    });
}
