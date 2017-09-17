import { Geometry, Point, Polygon } from 'wkx';
import { FieldResolvers } from '../../../apollo';
import { timestampResolvers } from '../../../db';
import { Region } from '../../../ww-commons';
import { isAdmin } from '../../users';
import { RegionRaw } from '../types';

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
  pois: region => region.pois || [],
  riversCount: () => 11,
  sectionsCount: () => 111,
  ...timestampResolvers,
};

export default resolvers;
