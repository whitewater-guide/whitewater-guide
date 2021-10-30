import { useFocusEffect } from '@react-navigation/native';
import { useSection } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';

import SectionFAB from '../SectionFAB';
import SectionTabsScreen from '../SectionTabsScreen';
import SectionInfoMenu from './SectionInfoMenu';
import SectionInfoView from './SectionInfoView';
import { SectionInfoNavProps } from './types';

const SectionInfoScreen: React.FC<SectionInfoNavProps> = ({ navigation }) => {
  const section = useSection();

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () =>
          section ? (
            <SectionInfoMenu
              sectionId={section.id}
              favorite={section.favorite}
            />
          ) : null,
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
