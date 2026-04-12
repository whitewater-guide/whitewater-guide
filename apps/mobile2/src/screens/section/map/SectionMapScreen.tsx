import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { MapSection } from '@whitewater-guide/clients';
import { getSectionContentBounds, useSection } from '@whitewater-guide/clients';
import { useCallback, useMemo } from 'react';

import FeaturesMap from '../../../components/map/FeaturesMap';
import {
  CameraProvider,
  LocationPermission,
  useLocationPermission,
} from '../../../components/map/hooks';
import { SelectedPOISheet } from '../../../components/map/panels/SelectedPOISheet';
import { useMapType } from '../../../features/settings';
import SectionTabsScreen from '../SectionTabsScreen';

function SectionMapScreen() {
  const section = useSection();
  const { mapType } = useMapType();
  const locationPermission = useLocationPermission();
  const locationPermissionGranted =
    locationPermission === LocationPermission.GRANTED;
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ headerRight: () => null });
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
      result.push({ ...gauge, name: 'Gauge' });
    }
    return result;
  }, [section]);

  return (
    <SectionTabsScreen>
      {!!(section?.shape && initialBounds) && (
        <CameraProvider>
          <FeaturesMap
            mapType={mapType}
            detailed
            locationPermissionGranted={locationPermissionGranted}
            initialBounds={initialBounds}
            sections={[section as MapSection]}
            pois={pois}
            testID="section-map"
          />
          <SelectedPOISheet />
        </CameraProvider>
      )}
    </SectionTabsScreen>
  );
}

export default SectionMapScreen;
