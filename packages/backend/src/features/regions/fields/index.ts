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
    const bnds = bounds.coordinates[0];
    bnds.pop();
    return bnds;
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
  hasPremiumAccess: async ({ id }, _, { purchasesLoader }) => {
    const ids = await purchasesLoader.loadPurchasedRegions();
    return ids.includes(id);
  },
  ...timestampResolvers,
};

export default regionFieldResolvers;
