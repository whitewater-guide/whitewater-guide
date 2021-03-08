import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';

import useDeleteDescent from './useDeleteDescent';

interface Props {
  descentId: string;
  close: () => void;
}

const DeleteDescentDialog: React.FC<Props> = ({ descentId, close }) => {
  const { t } = useTranslation();
  const { loading, deleteDescent } = useDeleteDescent(descentId);
  const onDelete = () => deleteDescent().finally(() => close());
  return (
    <Portal>
      <Dialog visible={true} onDismiss={close}>
        <Dialog.Content>
          <Paragraph>{t('screens:descent.deleteConfirmation')}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button disabled={loading} onPress={close}>
            {t('commons:cancel')}
          </Button>
          <Button disabled={loading} loading={loading} onPress={onDelete}>
            {t('commons:delete')}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DeleteDescentDialog;
