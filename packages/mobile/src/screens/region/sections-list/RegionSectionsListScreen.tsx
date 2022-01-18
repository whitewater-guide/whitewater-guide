import { useFocusEffect } from '@react-navigation/native';
import { useRegion, useSectionsList } from '@whitewater-guide/clients';
import React from 'react';

import FilterButton from '~/screens/region/FilterButton';

import RegionTabsScreen from '../RegionTabsScreen';
import { SectionsList } from './biglist';
import { RegionSectionsNavProps } from './types';

const RegionSectionsListScreen: React.FC<RegionSectionsNavProps> = ({
  navigation,
}) => {
  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () => <FilterButton />,
      });
    }, [navigation]),
  );

  const { sections, status, refresh } = useSectionsList();
  const region = useRegion();

  return (
    <RegionTabsScreen>
      <SectionsList
        status={status}
        sections={sections}
        region={region}
        refresh={refresh}
      />
    </RegionTabsScreen>
  );
};

export default RegionSectionsListScreen;
