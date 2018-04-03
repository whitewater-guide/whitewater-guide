import { AuthenticationRequiredError, ContextUser, ForbiddenError } from '../../apollo';
import db from '../../db';

const checkEditorPermissions = async (user: ContextUser | undefined, regionId: string | null) => {
  if (!user) {
    throw new AuthenticationRequiredError();
  }
  if (user.admin) {
    return true;
  }
  if (!regionId) {
    // only admin can create regions
    throw new ForbiddenError();
  }
  const { count } = await db(true).table('regions_editors')
    .where({ region_id: regionId, user_id: user.id })
    .count().first();
  if (Number(count) !== 1) {
    throw new ForbiddenError();
  }
  return true;
};

export default checkEditorPermissions;
