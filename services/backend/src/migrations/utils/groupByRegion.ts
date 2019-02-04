import pointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon, Position } from '@turf/helpers';
import isFunction from 'lodash/isFunction';
import { RegionRow, UNKNOWN_REGION } from './getRegionsForMatching';

type PositionGetter<T> = ((value: T) => Position) | keyof T;

export const groupByRegion = <S>(
  regions: RegionRow[],
  sections: S[],
  positionGetter: PositionGetter<S>,
): Map<RegionRow, S[]> => {
  const byRegion = new Map<RegionRow, S[]>();
  for (const s of sections) {
    let region = UNKNOWN_REGION;
    for (const r of regions) {
      const position: Position = isFunction(positionGetter)
        ? positionGetter(s)
        : (s[positionGetter] as any);
      const tPoint = point(position);
      const tPoly = polygon(r.bounds.coordinates);
      const inside = pointInPolygon(tPoint, tPoly);
      if (inside) {
        region = r;
        break;
      }
    }
    const regionSections = byRegion.get(region) || [];
    byRegion.set(region, [...regionSections, s]);
  }
  return byRegion;
};
