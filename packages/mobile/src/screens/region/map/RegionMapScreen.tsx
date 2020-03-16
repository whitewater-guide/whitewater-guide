import { useFocusEffect } from '@react-navigation/native';
import { useRegion, useSectionsList } from '@whitewater-guide/clients';
import React from 'react';
import { Map } from '~/components/map';
import { Screen } from '~/components/Screen';
import FilterButton from '~/screens/region/FilterButton';
import { RegionMapNavProps } from './types';

const RegionMapScreen: React.FC<RegionMapNavProps> = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      navigation.dangerouslyGetParent()?.setOptions({
        headerRight: () => <FilterButton />,
      });
    }, [navigation]),
  );

  const { node } = useRegion();
  const { sections } = useSectionsList();
  return (
    <Screen>
      {node && (
        <Map
          pois={node.pois}
          sections={sections}
          initialBounds={node.bounds}
          testID="region-map"
        />
      )}
    </Screen>
  );
};

export default RegionMapScreen;
