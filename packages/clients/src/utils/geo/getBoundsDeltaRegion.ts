import { CoordinateLoose } from '@whitewater-guide/commons';
import { getBBox } from './getBBox';

export function getBoundsDeltaRegion(
  bounds: CoordinateLoose[] | null | undefined,
) {
  if (!bounds) {
    return undefined;
  }
  const [minLng, maxLng, minLat, maxLat] = getBBox(bounds, true);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.abs(maxLat - minLat) / 2,
    longitudeDelta: Math.abs(maxLng - minLng) / 2,
  };
}
