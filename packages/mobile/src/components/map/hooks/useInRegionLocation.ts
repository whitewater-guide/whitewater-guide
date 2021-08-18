import Mapbox from '@react-native-mapbox-gl/maps';
import pointInPolygon from '@turf/boolean-point-in-polygon';
import { Feature, lineString, point, Polygon } from '@turf/helpers';
import lineToPolygon from '@turf/line-to-polygon';
import { ensureAltitude } from '@whitewater-guide/clients';
import { useEffect } from 'react';

import { useCamera } from './useCamera';

export const useInRegionLocation = (
  bounds: CodegenCoordinates[],
  locationPermissionGranted: boolean,
) => {
  const camera = useCamera();
  useEffect(() => {
    if (!camera || !locationPermissionGranted) {
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
        const poly = lineToPolygon(
          lineString(ensureAltitude(bounds)),
        ) as Feature<Polygon>;
        const isInRegion = pointInPolygon(pt, poly);

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
  }, [camera, locationPermissionGranted, bounds]);
};