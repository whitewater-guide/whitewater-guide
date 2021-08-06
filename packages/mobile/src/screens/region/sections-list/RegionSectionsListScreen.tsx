import { useFocusEffect } from '@react-navigation/native';
import { useRegion, useSectionsList } from '@whitewater-guide/clients';
import React from 'react';

import { Screen } from '~/components/Screen';
import FilterButton from '~/screens/region/FilterButton';

import SectionsList from './SectionsList';
import { RegionSectionsNavProps } from './types';

const RegionSectionsListScreen: React.FC<RegionSectionsNavProps> = ({
  navigation,
}) => {
  useFocusEffect(
    React.useCallback(() => {
      navigation.dangerouslyGetParent()?.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () => <FilterButton />,
      });
    }, [navigation]),
  );

  const { sections, status, refresh } = useSectionsList();
  const region = useRegion();
  return (
    <Screen>
      <SectionsList
        status={status}
        sections={sections}
        region={region}
        refresh={refresh}
      />
    </Screen>
  );
};

export default RegionSectionsListScreen;
