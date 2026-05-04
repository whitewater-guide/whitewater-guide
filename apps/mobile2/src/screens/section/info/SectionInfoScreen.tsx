import { useFocusEffect } from '@react-navigation/native';
import { useSection } from '@whitewater-guide/clients';
import { useCallback } from 'react';

import SectionFAB from '../SectionFAB';
import SectionTabsScreen from '../SectionTabsScreen';
import type { SectionInfoScreenProps } from './navigation-types';
import SectionInfoMenu from './SectionInfoMenu';
import SectionInfoView from './SectionInfoView';

function SectionInfoScreen({ navigation }: SectionInfoScreenProps) {
  const section = useSection();

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        headerRight: () =>
          section ? <SectionInfoMenu section={section} /> : null,
      });
    }, [navigation, section]),
  );

  return (
    <SectionTabsScreen>
      <SectionInfoView />
      <SectionFAB />
    </SectionTabsScreen>
  );
}

export default SectionInfoScreen;
