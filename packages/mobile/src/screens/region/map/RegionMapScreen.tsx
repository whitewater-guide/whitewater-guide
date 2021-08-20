import { useFocusEffect } from '@react-navigation/native';
import { useRegion, useSectionsList } from '@whitewater-guide/clients';
import React from 'react';
import { StyleSheet } from 'react-native';

import { Map } from '~/components/map';
import { Screen } from '~/components/Screen';
import FilterButton from '~/screens/region/FilterButton';

import { RegionMapNavProps } from './types';

const RegionMapScreen: React.FC<RegionMapNavProps> = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () => <FilterButton />,
      });
    }, [navigation]),
  );

  const region = useRegion();
  const { sections } = useSectionsList();
  return (
    <Screen style={StyleSheet.absoluteFill}>
      {region && (
        <Map
          pois={region.pois}
          sections={sections}
          initialBounds={region.bounds}
          testID="region-map"
        />
      )}
    </Screen>
  );
};

export default RegionMapScreen;
