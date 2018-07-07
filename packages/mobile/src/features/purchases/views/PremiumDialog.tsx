import noop from 'lodash/noop';
import React from 'react';
import { Dialog } from 'react-native-paper';
import { Region } from '../../ww-commons/features/regions';
import container from './container';
import { PremiumDialogContent } from './PremiumDialogContent';

const StatefulPremium = container(PremiumDialogContent);

interface Props {
  region: Region;
  sectionId?: string;
  visible: boolean;
  onCancel: () => void;
}

export const PremiumDialog: React.SFC<Props> = ({ region, sectionId, visible, onCancel }) => (
  <Dialog dismissable={false} onDismiss={noop} visible={visible} >
    <StatefulPremium
      cancelable
      region={region}
      sectionId={sectionId}
      onCancel={onCancel}
    />
  </Dialog>
);
