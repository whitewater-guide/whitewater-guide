import { useRegion, useSectionsList } from '@whitewater-guide/clients';

import FilterButton from '~/screens/region/FilterButton';
import React from 'react';
import { RegionSectionsNavProps } from './types';
import { Screen } from '~/components/Screen';
import SectionsList from './SectionsList';
import { useFocusEffect } from '@react-navigation/native';

const RegionSectionsListScreen: React.FC<RegionSectionsNavProps> = ({
  navigation,
}) => {
  useFocusEffect(
    React.useCallback(() => {
      navigation.dangerouslyGetParent()?.setOptions({
        headerRight: () => <FilterButton />,
      });
    }, [navigation]),
  );

  const { sections, status, refresh } = useSectionsList();
  const { node } = useRegion();
  return (
    <Screen>
      <SectionsList
        status={status}
        sections={sections}
        region={node}
        refresh={refresh}
      />
    </Screen>
  );
};

export default RegionSectionsListScreen;
