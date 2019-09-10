import { CoordinateLoose } from '@whitewater-guide/commons';

export const arrayToLatLngString = (coord?: CoordinateLoose) => {
  if (!coord) {
    return '';
  }
  const [lng, lat] = coord!;
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
};
