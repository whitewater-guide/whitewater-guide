import Mapbox from '@react-native-mapbox-gl/maps';
import pointInPolygon from '@turf/boolean-point-in-polygon';
import { lineString, point } from '@turf/helpers';
// @ts-ignore
import lineToPolygon from '@turf/line-to-polygon';
import { CoordinateLoose, withZeroAlt } from '@whitewater-guide/commons';
import { useEffect } from 'react';
import { useCamera } from './useCamera';

export const useInRegionLocation = (
  bounds: CoordinateLoose[],
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
        const poly = lineToPolygon(lineString(withZeroAlt(bounds)));
        const isInRegion = pointInPolygon(pt, poly);

        if (isInRegion) {
          camera.setCamera({
            centerCoordinate: [longitude, latitude],
            zoomLevel: 6,
            animationDuration: 600,
          });
        }
      })
      .catch(() => {});
  }, [camera, locationPermissionGranted]);
};
