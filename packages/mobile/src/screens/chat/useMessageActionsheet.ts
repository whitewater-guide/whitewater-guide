import { useActionSheet } from '@expo/react-native-action-sheet';
import { MatrixEvent } from 'matrix-js-sdk';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import showSnackbarMessage from '~/components/showSnackbarMessage';
import { getMessage, useChatClient } from '~/features/chat';
import copyAndToast from '~/utils/copyAndToast';

export default function useMessageActionsheet() {
  const { showActionSheetWithOptions } = useActionSheet();
  const { t } = useTranslation();
  const client = useChatClient();

  return useCallback(
    (message: MatrixEvent) => {
      showActionSheetWithOptions(
        {
          title: t('screens:chat.message.actionsheet.title'),
          options: [
            t('screens:chat.message.actionsheet.copy.title'),
            t('screens:chat.message.actionsheet.report.title'),
            t('commons:cancel'),
          ],
          cancelButtonIndex: 2,
        },
        (index: number) => {
          if (index === 0) {
            copyAndToast(getMessage(message));
          }
          if (index === 1) {
            client
              .reportEvent(message.getRoomId(), message.getId(), -10, '')
              .then(() => {
                showSnackbarMessage(
                  'screens:chat.message.actionsheet.report.sent',
                );
              })
              .catch(() => {
                showSnackbarMessage(
                  'screens:chat.message.actionsheet.report.error',
                );
              });
          }
        },
      );
    },
    [showActionSheetWithOptions, t, client],
  );
}
