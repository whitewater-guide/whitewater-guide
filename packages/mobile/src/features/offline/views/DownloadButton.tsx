import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button, Dialog } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import theme from '../../../theme';
import { offlineContentActions } from '../actions';
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

  const dispatch = useDispatch();
  const handlers = useMemo(
    () => ({
      onDismiss: () => dispatch(offlineContentActions.toggleDialog(null)),
      onDownload: () =>
        dispatch(offlineContentActions.startDownload({ regionId, selection })),
    }),
    [dispatch, regionId, selection],
  );

  return (
    <Dialog.Actions>
      <Button mode="outlined" onPress={handlers.onDismiss}>
        {t('commons:cancel')}
      </Button>
      <Button
        mode="contained"
        disabled={!canDownload}
        onPress={handlers.onDownload}
        style={styles.okButton}
      >
        {t('offline:dialog.download')}
      </Button>
    </Dialog.Actions>
  );
};

DownloadButton.displayName = 'DownloadButton';

export default DownloadButton;
