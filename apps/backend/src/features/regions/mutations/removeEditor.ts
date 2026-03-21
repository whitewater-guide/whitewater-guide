import type { MutationResolvers } from '../../../apollo/index';
import { db } from '../../../db/index';
import logger from '../logger';

const removeEditor: MutationResolvers['removeEditor'] = async (
  _,
  { regionId, userId },
) => {
  logger.debug({ regionId, userId }, 'remove editor');
  await db()
    .table('regions_editors')
    .del()
    .where({ region_id: regionId, user_id: userId });
  return true;
};

export default removeEditor;
