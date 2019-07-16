import { Coordinate2d } from '@whitewater-guide/commons';

interface LatLng {
  lat: number | (() => number);
  lng: number | (() => number);
}

/**
 * converts google maps coordinates to our coordinates
 * @param latLng
 */
export function gmapsToArray(latLng?: LatLng | null): Coordinate2d | null {
  if (!latLng) {
    return null;
  }
  const { lat, lng } = latLng;
  const latitude: number = typeof lat === 'number' ? lat : lat();
  const longitude: number = typeof lng === 'number' ? lng : lng();
  return [longitude, latitude];
}
