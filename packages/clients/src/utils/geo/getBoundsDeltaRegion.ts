import { getBBox } from './getBBox';

export interface BoundsDeltaRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export function getBoundsDeltaRegion(
  bounds: CodegenCoordinates[] | null | undefined,
): BoundsDeltaRegion | undefined {
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
