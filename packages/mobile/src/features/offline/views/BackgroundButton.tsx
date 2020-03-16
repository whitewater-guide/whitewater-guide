import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { useOfflineContent } from '../OfflineContentProvider';

const BackgroundButton: React.FC = () => {
  const { t } = useTranslation();
  const { setDialogRegion } = useOfflineContent();
  const label = t('offline:dialog.inBackground');
  const onDismiss = useCallback(() => setDialogRegion(null), [setDialogRegion]);

  return (
    <Button mode="outlined" onPress={onDismiss} accessibilityLabel={label}>
      {label}
    </Button>
  );
};

export default BackgroundButton;
