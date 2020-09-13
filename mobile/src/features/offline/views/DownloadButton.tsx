import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import theme from '../../../theme';
import { useOfflineContent } from '../OfflineContentProvider';
import { OfflineCategorySelection } from '../types';

const styles = StyleSheet.create({
  okButton: {
    marginLeft: theme.margin.single,
    minWidth: 80,
  },
});

interface Props {
  canDownload: boolean;
  selection: OfflineCategorySelection;
  regionId: string;
}

const DownloadButton: React.FC<Props> = ({
  canDownload,
  regionId,
  selection,
}) => {
  const { t } = useTranslation();
  const { download } = useOfflineContent();

  const onDownload = useCallback(() => {
    download(regionId, selection);
  }, [download, regionId, selection]);

  return (
    <Button
      mode="contained"
      disabled={!canDownload}
      onPress={onDownload}
      style={styles.okButton}
      accessibilityLabel={t('offline:dialog.download')}
    >
      {t('offline:dialog.download')}
    </Button>
  );
};

export default DownloadButton;
