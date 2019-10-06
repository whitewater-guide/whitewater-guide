import noop from 'lodash/noop';
import React from 'react';
import { Dialog } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { offlineContentSelectors } from '../selectors';
import LazyOfflineContentDialogView from './LazyOfflineContentDialogView';

const OfflineContentDialog: React.FC = () => {
  const { region, progress, inProgress, error } = useSelector(
    offlineContentSelectors.dialogState,
  );

  if (!region) {
    return null;
  }

  return (
    <Dialog dismissable={false} onDismiss={noop} visible={true}>
      <LazyOfflineContentDialogView
        region={region}
        inProgress={inProgress}
        progress={progress}
        error={error}
      />
    </Dialog>
  );
};

OfflineContentDialog.displayName = 'OfflineContentDialog';

export default OfflineContentDialog;
