import { Geometry, Polygon } from 'wkx';
import { FieldResolvers } from '../../../apollo';
import { timestampResolvers } from '../../../db';
import { Region } from '../../../ww-commons';
import checkEditorPermissions from '../checkEditorPermissions';
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
  editable: async ({ id, editable }, _, { user }) => {
    if (!user) {
      return false;
    }
    if (user.admin) {
      return true;
    }
    if (typeof(editable) === 'boolean') {
      return editable;
    }
    try {
      await checkEditorPermissions(user, id);
    } catch {
      return false;
    }
    return true;
  },
  ...timestampResolvers,
};

export default regionFieldResolvers;
