import Mapbox from '@rnmapbox/maps';
// @ts-ignore
import pointInPolygon from '@turf/boolean-point-in-polygon';
// @ts-ignore - @turf/helpers v6 has CJS-only exports
import { lineString, point } from '@turf/helpers';
// @ts-ignore
import lineToPolygon from '@turf/line-to-polygon';
import { ensureAltitude } from '@whitewater-guide/clients';
import { useEffect } from 'react';
import type { AppStateStatus } from 'react-native';

import { useCamera } from './useCamera';

export function useInRegionLocation(
  bounds: CodegenCoordinates[],
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
        const pt = point([longitude, latitude]);
        const poly = lineToPolygon(lineString(ensureAltitude(bounds)));
        const isInRegion = pointInPolygon(pt, poly as any);

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
