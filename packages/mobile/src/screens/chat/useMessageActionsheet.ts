import { useActionSheet } from '@expo/react-native-action-sheet';
import { useAuth } from '@whitewater-guide/clients';
import type { MatrixEvent } from 'matrix-js-sdk';
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
      const roomId = message.getRoomId();
      const messageId = message.getId();
      const sender = message.getSender();
      if (!roomId || !messageId) {
        return;
      }
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
              .reportEvent(roomId, messageId, -10, '')
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

      if (
        myId &&
        message.getSender()?.includes(myId) &&
        !message.isRedacted() &&
        message.getId()
      ) {
        options.push({
          title: t('screens:chat.message.actionsheet.delete.title'),
          handler: () => {
            client.redactEvent(roomId, messageId);
          },
          destructive: true,
        });
      }
      if (!!myId && sender?.includes(myId)) {
        options.push({
          title: t('screens:chat.message.actionsheet.blockUser.title'),
          handler: () => {
            const ignoredUsers = new Set(client.getIgnoredUsers());
            ignoredUsers.add(sender);
            client
              .setIgnoredUsers(Array.from(ignoredUsers))
              .then(() => {
                showSnackbarMessage(
                  'screens:chat.message.actionsheet.blockUser.sent',
                );
              })
              .catch(() => {
                showSnackbarMessage(
                  'screens:chat.message.actionsheet.blockUser.error',
                );
              });
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
