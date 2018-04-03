import { AuthenticationRequiredError, ContextUser, ForbiddenError } from '../../apollo';
import db from '../../db';

const checkEditorPermissions = async (user?: ContextUser, riverId?: string | null, regionId?: string) => {
  if (!user) {
    throw new AuthenticationRequiredError();
  }
  if (user.admin) {
    return true;
  }
  if (!riverId && !regionId) {
    // this should not happen, just in case
    throw new ForbiddenError();
  }
  const query = db().select('regions_editors.region_id').from('regions_editors')
    .where({ user_id: user.id });
  if (riverId) {
    query.innerJoin('rivers', 'rivers.region_id', '=', 'regions_editors.region_id')
      .where('rivers.id', riverId);
  } else if (regionId) {
    query.where({ region_id: regionId });
  }

  const { rows: [{ exists }] } = await db().raw(`SELECT EXISTS (${query.toString()})`);
  if (!exists) {
    throw new ForbiddenError();
  }
  return true;
};

export default checkEditorPermissions;
