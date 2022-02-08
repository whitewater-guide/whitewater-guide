import { useFocusEffect } from '@react-navigation/native';
import { useSection } from '@whitewater-guide/clients';
import React from 'react';

import SectionFAB from '../SectionFAB';
import SectionTabsScreen from '../SectionTabsScreen';
import SectionInfoMenu from './SectionInfoMenu';
import SectionInfoView from './SectionInfoView';
import { SectionInfoNavProps } from './types';

const SectionInfoScreen: React.FC<SectionInfoNavProps> = ({ navigation }) => {
  const section = useSection();

  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        headerRight: () =>
          section ? <SectionInfoMenu section={section} /> : null,
      });
    }, [navigation, section]),
  );

  return (
    <SectionTabsScreen>
      <SectionInfoView />
      <SectionFAB testID="section-info-fab" />
    </SectionTabsScreen>
  );
};

export default SectionInfoScreen;
