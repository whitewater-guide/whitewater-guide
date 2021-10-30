import { useFocusEffect } from '@react-navigation/native';
import { useRegion, useSectionsList } from '@whitewater-guide/clients';
import React from 'react';

import { Map } from '~/components/map';
import FilterButton from '~/screens/region/FilterButton';

import RegionTabsScreen from '../RegionTabsScreen';
import { RegionMapNavProps } from './types';

const RegionMapScreen: React.FC<RegionMapNavProps> = ({ navigation }) => {
  const region = useRegion();
  const { sections } = useSectionsList();

  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () => (sections ? <FilterButton /> : null),
      });
    }, [navigation, sections]),
  );

  return (
    <RegionTabsScreen>
      {region && (
        <Map
          pois={region.pois}
          sections={sections ?? []}
          initialBounds={region.bounds}
          testID="region-map"
        />
      )}
    </RegionTabsScreen>
  );
};

export default RegionMapScreen;
