import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSection } from '@whitewater-guide/clients';
import { useCallback } from 'react';

import SectionFAB from '../SectionFAB';
import SectionTabsScreen from '../SectionTabsScreen';
import SectionInfoMenu from './SectionInfoMenu';
import SectionInfoView from './SectionInfoView';

function SectionInfoScreen() {
  const section = useSection();
  const navigation = useNavigation();

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
