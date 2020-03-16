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
