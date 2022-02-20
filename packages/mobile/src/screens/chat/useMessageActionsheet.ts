import { useActionSheet } from '@expo/react-native-action-sheet';
import { useAuth } from '@whitewater-guide/clients';
import { MatrixEvent } from 'matrix-js-sdk';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import showSnackbarMessage from '~/components/showSnackbarMessage';
import { getMessage, useChatClient } from '~/features/chat';
import copyAndToast from '~/utils/copyAndToast';

interface Option {
  title: string;
  handler: () => void;
  destructive?: boolean;
}

export default function useMessageActionsheet() {
  const { showActionSheetWithOptions } = useActionSheet();
  const { t } = useTranslation();
  const client = useChatClient();
  const { me } = useAuth();
  const myId = me?.id;

  return useCallback(
    (message: MatrixEvent) => {
      const options: Option[] = [
        {
          title: t('screens:chat.message.actionsheet.copy.title'),
          handler: () => {
            copyAndToast(getMessage(message));
          },
        },
        {
          title: t('screens:chat.message.actionsheet.report.title'),
          handler: () => {
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
          },
        },
      ];

      if (myId && message.getSender().includes(myId) && !message.isRedacted()) {
        options.push({
          title: t('screens:chat.message.actionsheet.delete.title'),
          handler: () => {
            client.redactEvent(message.getRoomId(), message.getId());
          },
          destructive: true,
        });
      }

      showActionSheetWithOptions(
        {
          title: t('screens:chat.message.actionsheet.title'),
          options: [...options.map((o) => o.title), t('commons:cancel')],
          cancelButtonIndex: options.length,
          destructiveButtonIndex: options.findIndex((o) => o.destructive),
        },
        (index: number) => {
          const handler = options[index];
          handler?.handler();
        },
      );
    },
    [showActionSheetWithOptions, t, client, myId],
  );
}
