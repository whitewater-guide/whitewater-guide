import { AuthenticationRequiredError, ContextUser, ForbiddenError } from '../../apollo';
import db from '../../db/db';

const checkEditorPermissions = async (user?: ContextUser, sectionId?: string | null, riverId?: string) => {
  if (!user) {
    throw new AuthenticationRequiredError();
  }
  if (user.admin) {
    return true;
  }
  if (!riverId && !sectionId) {
    throw new ForbiddenError();
  }
  const query = db().select('regions_editors.region_id').from('regions_editors').where({ user_id: user.id })
    .innerJoin('rivers', 'regions_editors.region_id', '=', 'rivers.region_id');
  if (riverId) {
    query.where('rivers.id', riverId);
  } else if (sectionId) {
      query.innerJoin('sections', 'rivers.id', '=', 'sections.river_id')
        .where('sections.id', sectionId);
  }

  const { rows: [{ exists }] } = await db().raw(`SELECT EXISTS (${query.toString()})`);
  if (!exists) {
    throw new ForbiddenError();
  }
  return true;
};

export default checkEditorPermissions;
