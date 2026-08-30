import type { Coordinates } from '@/types/coordinates';

export function arrayToLatLngString(coord?: Coordinates): string {
  if (!coord) {
    return '';
  }
  const [lng, lat] = coord;
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}
