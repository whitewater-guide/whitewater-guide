import type { Context, RegionResolvers } from '../../../apollo/index';
import type { ResolvableRegion } from '../types';

const editableResolver: RegionResolvers<
  Context,
  ResolvableRegion
>['editable'] = async ({ id, editable }, _, { user, dataSources }) => {
  if (!user) {
    return false;
  }
  if (user.admin) {
    return true;
  }
  if (typeof editable === 'boolean') {
    return editable;
  }
  try {
    await dataSources.users.assertEditorPermissions({ regionId: id });
  } catch {
    return false;
  }
  return true;
};

export default editableResolver;
