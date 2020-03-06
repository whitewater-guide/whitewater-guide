import { useSection } from '@whitewater-guide/clients';
import { Screen } from 'components/Screen';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import SuggestionFAB from '../SuggestionFAB';
import SectionInfoView from './SectionInfoView';

const SectionInfoScreen: NavigationScreenComponent = () => {
  const node = useSection();
  return (
    <Screen>
      <SectionInfoView section={node} />
      <SuggestionFAB testID="section-info-fab" />
    </Screen>
  );
};

export default SectionInfoScreen;
