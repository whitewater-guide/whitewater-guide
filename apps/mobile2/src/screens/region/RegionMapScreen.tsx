import { useRegion, useSectionsList } from '@whitewater-guide/clients';
import React from 'react';

import CameraControls from '../../components/map/CameraControls';
import FeaturesMap from '../../components/map/FeaturesMap';
import { CameraProvider } from '../../components/map/hooks/useCamera';
import {
  LocationPermission,
  useLocationPermission,
} from '../../components/map/hooks/useLocationPermission';
import LayersSelector from '../../components/map/LayersSelector';
import { SelectedPOISheet } from '../../components/map/panels/SelectedPOISheet';
import { SelectedSectionSheet } from '../../components/map/panels/SelectedSectionSheet';
import { useMapType } from '../../features/settings';

function RegionMapScreen() {
  const region = useRegion();
  const { sections } = useSectionsList();
  const locationPermission = useLocationPermission();
  const locationPermissionGranted =
    locationPermission === LocationPermission.GRANTED;
  const { mapType } = useMapType();

  if (!region) {
    return null;
  }

  return (
    <CameraProvider>
      <FeaturesMap
        mapType={mapType}
        detailed={false}
        locationPermissionGranted={locationPermissionGranted}
        initialBounds={region.bounds}
        sections={sections ?? []}
        pois={region.pois ?? []}
      />
      <LayersSelector />
      <CameraControls
        locationPermissionGranted={locationPermissionGranted}
        initialBounds={region.bounds}
      />
      <SelectedSectionSheet />
      <SelectedPOISheet />
    </CameraProvider>
  );
}

export default RegionMapScreen;
