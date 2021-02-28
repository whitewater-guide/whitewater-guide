import { CoordinateLoose } from '@whitewater-guide/commons';

export function arrayToLatLngString(coord?: CoordinateLoose): string {
  if (!coord) {
    return '';
  }
  const [lng, lat] = coord;
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}
