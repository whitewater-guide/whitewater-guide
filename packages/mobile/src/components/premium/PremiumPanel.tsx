import React from 'react';
import { Paper } from '../Paper';
import container from './container';
import { PremiumDialogContent } from './PremiumDialogContent';

const StatefulPremium = container(PremiumDialogContent);

interface Props {
  sectionId: string;
}

export const PremiumPanel: React.SFC<Props> = ({ sectionId }) => (
  <Paper>
    <StatefulPremium cancelable={false} sectionId={sectionId} />
  </Paper>
);
