import Mapbox from '@rnmapbox/maps';
import { useEffect } from 'react';
import type { AppStateStatus } from 'react-native';

import { useCamera } from './use-camera';

import type { Coordinates } from '@/types/coordinates';
import { ensureAltitude, pointInClosedRing } from '@/utils/geo';

export function useInRegionLocation(
  bounds: Coordinates[],
  locationPermissionGranted: boolean,
  appState: AppStateStatus,
): void {
  const camera = useCamera();

  useEffect(() => {
    if (!camera || !locationPermissionGranted || appState !== 'active') {
      return;
    }
    Mapbox.locationManager
      .getLastKnownLocation()
      .then((location) => {
        if (!location) {
          return;
        }
        const {
          coords: { latitude, longitude },
        } = location;
        const ring = ensureAltitude(bounds);
        const isInRegion = pointInClosedRing(longitude, latitude, ring);

        if (isInRegion) {
          camera.setCamera({
            centerCoordinate: [longitude, latitude],
            zoomLevel: 6,
            animationDuration: 600,
          });
        }
      })
      .catch(() => {
        // do not care if we fail
      });
  }, [camera, locationPermissionGranted, bounds, appState]);
}
