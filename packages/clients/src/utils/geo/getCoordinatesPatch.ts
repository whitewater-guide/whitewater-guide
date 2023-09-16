import type { Coordinate2d } from './types';

/**
 * Compares 2 arrays of [lng, lat] pairs and return patch in `immutability-helper` $splice format
 * @param prev Old value
 * @param next New value
 * @returns {*}
 */
export function getCoordinatesPatch(
  prev: Coordinate2d[],
  next: Coordinate2d[],
): [number, number?] | [number, number, ...Coordinate2d[]] | null {
  const delta = next.length - prev.length;
  const delCount = delta > 0 ? 0 : 1;
  const min = Math.min(prev.length, next.length);
  for (let i = 0; i < min; i += 1) {
    if (prev[i][0] !== next[i][0] || prev[i][1] !== next[i][1]) {
      const patch: [number, number, ...Coordinate2d[]] = [i, delCount];
      if (delta >= 0) {
        patch.push([next[i][0], next[i][1]]);
      }
      return patch;
    }
  }
  if (delta > 0) {
    // Insert in the end
    return [prev.length, 0, next[next.length - 1]];
  }
  if (delta < 0) {
    // Delete the last
    return [next.length, 1];
  }
  return null;
}
