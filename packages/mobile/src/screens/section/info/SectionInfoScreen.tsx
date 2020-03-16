import { useSection } from '@whitewater-guide/clients';
import React from 'react';
import { Screen } from '~/components/Screen';
import SuggestionFAB from '../SuggestionFAB';
import SectionInfoView from './SectionInfoView';
import { SectionInfoNavProps } from './types';

const SectionInfoScreen: React.FC<SectionInfoNavProps> = () => {
  const node = useSection();
  return (
    <Screen>
      <SectionInfoView section={node} />
      <SuggestionFAB testID="section-info-fab" />
    </Screen>
  );
};

export default SectionInfoScreen;
