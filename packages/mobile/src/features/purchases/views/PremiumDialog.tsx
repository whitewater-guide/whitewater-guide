import noop from 'lodash/noop';
import React from 'react';
import { Dialog } from 'react-native-paper';
import { container, MergedProps } from './container';
import { PremiumDialogView } from './PremiumDialogView';

const PremiumDialog: React.SFC<MergedProps> = ({ visible, ...props }) => (
  <Dialog dismissable={false} onDismiss={noop} visible={visible} >
    <PremiumDialogView {...props} />
  </Dialog>
);

export default container(PremiumDialog);
