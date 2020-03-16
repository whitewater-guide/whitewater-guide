import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { useOfflineContent } from '../OfflineContentProvider';

const CancelButton: React.FC = () => {
  const { t } = useTranslation();
  const { setDialogRegion } = useOfflineContent();
  const onDismiss = useCallback(() => {
    setDialogRegion(null);
  }, [setDialogRegion]);

  return (
    <Button
      mode="outlined"
      onPress={onDismiss}
      accessibilityLabel={t('commons:cancel')}
    >
      {t('commons:cancel')}
    </Button>
  );
};

export default CancelButton;
