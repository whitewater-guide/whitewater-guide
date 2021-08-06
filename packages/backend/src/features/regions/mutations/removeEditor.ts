import { MutationResolvers } from '~/apollo';
import { db } from '~/db';

const removeEditor: MutationResolvers['removeEditor'] = async (
  _,
  { regionId, userId },
) => {
  await db()
    .table('regions_editors')
    .del()
    .where({ region_id: regionId, user_id: userId });
  return true;
};

export default removeEditor;
