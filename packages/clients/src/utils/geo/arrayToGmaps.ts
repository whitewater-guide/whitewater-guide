import { Coordinate } from '@whitewater-guide/commons';

interface LatLngLiteral {
  lat: number;
  lng: number;
}

/**
 * Converts our coordinate to google maps format
 * @param array
 */
export function arrayToGmaps(array?: Coordinate | null): LatLngLiteral | null {
  if (!array) {
    return null;
  }
  const [lng, lat] = array;
  return { lat, lng };
}
