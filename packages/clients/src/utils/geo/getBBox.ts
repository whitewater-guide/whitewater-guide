import { CoordinateLoose } from '@whitewater-guide/commons';

export type BBox = [[number, number], [number, number]];
export type BBoxFlat = [number, number, number, number];

/**
 * Get bounding box for array of [lng, lat] pairs
 * @param bounds
 * @returns [minLng, maxLng, minLat, maxLat]
 */
export function getBBox(bounds: CoordinateLoose[], flat?: false): BBox;
export function getBBox(bounds: CoordinateLoose[], flat?: true): BBoxFlat;
export function getBBox(
  bounds: CoordinateLoose[],
  flat = false,
): BBox | BBoxFlat {
  const flatBox = bounds.reduce<BBoxFlat>(
    ([mnLng, mxLng, mnLat, mxLat], [lng, lat]) => [
      Math.min(mnLng, lng),
      Math.max(mxLng, lng),
      Math.min(mnLat, lat),
      Math.max(mxLat, lat),
    ],
    [bounds[0][0], bounds[0][0], bounds[0][1], bounds[0][1]],
  );
  if (flat) {
    return flatBox;
  }
  const [minLng, maxLng, minLat, maxLat] = flatBox;
  return [
    [maxLng, maxLat],
    [minLng, minLat],
  ];
}
