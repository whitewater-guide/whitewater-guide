import { MutationResolvers } from '~/apollo';
import { db } from '~/db';

import logger from '../logger';

const addEditor: MutationResolvers['addEditor'] = async (
  _,
  { regionId, userId },
) => {
  logger.debug({ regionId, userId }, 'add editor');
  const query = db()
    .table('regions_editors')
    .insert({ region_id: regionId, user_id: userId });
  const rawQuery = `${query.toString()} ON CONFLICT DO NOTHING`;
  await db().raw(rawQuery);
  return true;
};

export default addEditor;
