import noop from 'lodash/noop';
import React from 'react';
import { Dialog } from 'react-native-paper';
import { connect } from 'react-redux';
import { RootState } from '../../../core/reducers';
import container from './container';
import { PremiumDialogView } from './PremiumDialogView';

const PremiumDialogViewWithData = container(PremiumDialogView);

interface Props {
  visible: boolean;
}

const PremiumDialog: React.SFC<Props> = ({ visible }) => (
  <Dialog dismissable={false} onDismiss={noop} visible={visible} >
    <PremiumDialogViewWithData />
  </Dialog>
);

export default connect(
  (state: RootState) => ({
    visible: state.purchase.dialogOpen,
  }),
)(PremiumDialog);
