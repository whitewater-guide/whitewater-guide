import { CoordinateLoose } from '@whitewater-guide/commons';
import take from 'lodash/take';

/**
 * Converts coordinates to string like '46°59′4″ N, 122°54′8″ W'
 * @param coordinates
 */
export function arrayToDMSString(coordinates: CoordinateLoose): string {
  const truncate = (n: number) => (n > 0 ? Math.floor(n) : Math.ceil(n));
  const latHemisphere = coordinates[1] < 0 ? 'S' : 'N';
  const lonHemisphere = coordinates[0] < 0 ? 'W' : 'E';
  const hemispheres = [lonHemisphere, latHemisphere];
  return take(coordinates, 2)
    .map((dd: number, i: number) => {
      const absDD = Math.abs(dd);
      const degrees = truncate(absDD);
      const minutes = truncate((absDD - degrees) * 60);
      let seconds = (absDD - degrees - minutes / 60) * 3600;
      seconds = truncate(seconds);
      return `${degrees}°${minutes}′${seconds}″ ${hemispheres[i]}`;
    })
    .reverse()
    .join(', ');
}
