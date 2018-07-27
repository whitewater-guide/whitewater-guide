import { AuthenticationRequiredError, ContextUser, ForbiddenError } from '@apollo';
import db from '@db';
import { QueryBuilder } from 'knex';

const checkEditorPermissions = async (user?: ContextUser, mediaId?: string, sectionId?: string) => {
  if (!user) {
    throw new AuthenticationRequiredError();
  }
  if (user.admin) {
    return true;
  }
  let query: QueryBuilder;
  if (!mediaId && !sectionId) {
    // New media form, any editor is allowed to create it
    query = db().select('region_id').from('regions_editors').where({ user_id: user.id });
  } else {
    query = db().select('rivers.region_id').from('sections')
      .innerJoin('rivers', 'sections.river_id', '=', 'rivers.id')
      .innerJoin('regions_editors', 'rivers.region_id', '=', 'regions_editors.region_id')
      .where({ user_id: user.id });
    if (sectionId) {
      query.where('sections.id', sectionId);
    } else if (mediaId) {
      query.innerJoin('sections_media', 'sections.id', '=', 'sections_media.section_id')
        .where({ media_id: mediaId });
    }
  }

  const { rows: [{ exists }] } = await db().raw(`SELECT EXISTS (${query.toString()})`);
  if (!exists) {
    throw new ForbiddenError();
  }
  return true;
};

export default checkEditorPermissions;
