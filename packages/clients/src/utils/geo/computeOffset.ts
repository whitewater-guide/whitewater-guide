import { EARTH_RADIUS_KM } from './constants';

interface LatitudeLongitude {
  latitude: number;
  longitude: number;
}

/**
 * Computes coordinate of a point located at given distance and bearing from given point
 * @param latitude
 * @param longitude
 * @param distance
 * @param heading
 */
export function computeOffset(
  { latitude, longitude }: LatitudeLongitude,
  distance: number,
  heading: number,
) {
  const distanceNorm = distance / EARTH_RADIUS_KM;
  const headingRad = (Math.PI * heading) / 180;
  const fromLat = (Math.PI * latitude) / 180;
  const fromLng = (Math.PI * longitude) / 180;
  const cosDistance = Math.cos(distanceNorm);
  const sinDistance = Math.sin(distanceNorm);
  const sinFromLat = Math.sin(fromLat);
  const cosFromLat = Math.cos(fromLat);
  const sinLat =
    cosDistance * sinFromLat + sinDistance * cosFromLat * Math.cos(headingRad);
  const dLng = Math.atan2(
    sinDistance * cosFromLat * Math.sin(headingRad),
    cosDistance - sinFromLat * sinLat,
  );
  return {
    latitude: (180 * Math.asin(sinLat)) / Math.PI,
    longitude: (180 * (fromLng + dLng)) / Math.PI,
  };
}
