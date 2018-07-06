import React from 'react';
import { Dialog } from 'react-native-paper';
import { PremiumRegion } from './types';

interface Props {
  region: PremiumRegion;
  sectionId?: string;
  visible?: boolean;
}

export class PremiumDialog extends React.PureComponent<Props> {
  render() {
    return (
      <Dialog onDismiss={() => {}} visible />
    );
  }
}