import { Coordinate2d } from '@whitewater-guide/commons';

/**
 * Compares 2 arrays of [lng, lat] pairs and return patch in `immutability-helper` $splice format
 * @param prev Old value
 * @param next New value
 * @returns {*}
 */
export function getCoordinatesPatch(
  prev: Coordinate2d[],
  next: Coordinate2d[],
): any[] | null {
  const delta = next.length - prev.length;
  const delCount = delta > 0 ? 0 : 1;
  const min = Math.min(prev.length, next.length);
  for (let i = 0; i < min; i += 1) {
    if (prev[i][0] !== next[i][0] || prev[i][1] !== next[i][1]) {
      const patch: any[] = [i, delCount];
      if (delta >= 0) {
        patch.push([next[i][0], next[i][1]]);
      }
      return patch;
    }
  }
  if (delta > 0) {
    // Insert in the end
    return [prev.length, 0, next[next.length - 1]];
  } else if (delta < 0) {
    // Delete the last
    return [next.length, 1];
  }
  return null;
}
