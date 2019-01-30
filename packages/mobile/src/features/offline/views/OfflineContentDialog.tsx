import noop from 'lodash/noop';
import React from 'react';
import { Dialog } from 'react-native-paper';
import { connect } from 'react-redux';
import { RootState } from '../../../core/reducers';
import container from './container';
import OfflineContentDialogView from './OfflineContentDialogView';

const DialogViewWithData = container(OfflineContentDialogView);

interface Props {
  visible: boolean;
}

const PremiumDialog: React.SFC<Props> = ({ visible }) => (
  <Dialog dismissable={false} onDismiss={noop} visible={visible}>
    <DialogViewWithData />
  </Dialog>
);

export default connect((state: RootState) => ({
  visible: !!state.offlineContent.dialogRegion,
}))(PremiumDialog);
