import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { offlineContentActions } from '../actions';

const BackgroundButton: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onDismiss = useCallback(
    () => dispatch(offlineContentActions.toggleDialog(null)),
    [dispatch],
  );

  return (
    <Dialog.Actions>
      <Button mode="outlined" onPress={onDismiss}>
        {t('offline:dialog.inBackground')}
      </Button>
    </Dialog.Actions>
  );
};

BackgroundButton.displayName = 'BackgroundButton';

export default BackgroundButton;
