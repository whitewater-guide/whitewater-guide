import { MutationResolvers } from '~/apollo';
import { db } from '~/db';

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
