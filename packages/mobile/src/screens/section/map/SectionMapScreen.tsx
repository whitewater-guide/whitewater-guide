import { useFocusEffect } from '@react-navigation/native';
import type { MapSection } from '@whitewater-guide/clients';
import { getSectionContentBounds, useSection } from '@whitewater-guide/clients';
import React, { useMemo } from 'react';

import { Map, SelectedPOISheet } from '~/components/map';

import SectionTabsScreen from '../SectionTabsScreen';
import type { SectionMapNavProps } from './types';

const SectionMapScreen: React.FC<SectionMapNavProps> = ({ navigation }) => {
  const section = useSection();

  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () => null,
      });
    }, [navigation]),
  );

  const initialBounds = useMemo(
    () => getSectionContentBounds(section),
    [section],
  );

  const pois = useMemo(() => {
    if (!section) {
      return [];
    }

    const result = [...(section.pois ?? [])];
    const gauge = section.gauge?.location;
    if (gauge) {
      const gaugePt = { ...gauge, name: 'Gauge' };
      result.push(gaugePt);
    }
    return result;
  }, [section]);

  return (
    <SectionTabsScreen>
      {!!(section?.shape && initialBounds) && (
        <Map
          sections={[section as MapSection]}
          initialBounds={initialBounds}
          pois={pois}
          detailed
          testID="section-map"
        />
      )}
      <SelectedPOISheet />
    </SectionTabsScreen>
  );
};

export default SectionMapScreen;
