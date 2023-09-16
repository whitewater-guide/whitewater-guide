import type { MutationResolvers } from '../../../apollo/index';
import { db } from '../../../db/index';

const removeSource: MutationResolvers['removeSource'] = async (
  _,
  { id },
  { dataSources },
) => {
  const [result] = await db()
    .table('sources')
    .del()
    .where({ id })
    .returning('id');
  const deletedId = result.id;
  await dataSources.gorge.deleteJobForSource(deletedId);
  return deletedId;
};

export default removeSource;
