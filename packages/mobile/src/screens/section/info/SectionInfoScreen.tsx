import React from 'react';

import { Screen } from '~/components/Screen';

import SectionFAB from '../SectionFAB';
import SectionInfoView from './SectionInfoView';
import { SectionInfoNavProps } from './types';

const SectionInfoScreen: React.FC<SectionInfoNavProps> = () => {
  return (
    <Screen>
      <SectionInfoView />
      <SectionFAB testID="section-info-fab" />
    </Screen>
  );
};

export default SectionInfoScreen;
