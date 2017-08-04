import { Geometry, Point, Polygon } from 'wkx';
import { FieldResolvers } from '../../../apollo';
import { timestampResolvers } from '../../../db';
import { isAdmin } from '../../users';
import { Region, RegionRaw } from '../types';

const resolvers: FieldResolvers<RegionRaw, Region> = {
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
  hidden: ({ hidden }, args, { user }) => isAdmin(user) ? hidden : null,
  ...timestampResolvers,
};

export default resolvers;
