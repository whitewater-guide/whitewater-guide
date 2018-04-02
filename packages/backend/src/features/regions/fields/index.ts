import { Geometry, Polygon } from 'wkx';
import { FieldResolvers } from '../../../apollo';
import { timestampResolvers } from '../../../db';
import { isAdmin, Region } from '../../../ww-commons';
import { RegionRaw } from '../types';

const regionFieldResolvers: FieldResolvers<RegionRaw, Region> = {
  seasonNumeric: region => region.season_numeric,
  bounds: ({ bounds }) => {
    if (!bounds) {
      return null;
    }
    const polygon = Geometry.parse(bounds) as Polygon;
    const points = polygon.exteriorRing;
    // Un-close the polygon for client
    points.pop();
    return points.map(({ x, y, z }) => [x, y, z]);
  },
  pois: region => region.pois || [],
  ...timestampResolvers,
};

export default regionFieldResolvers;