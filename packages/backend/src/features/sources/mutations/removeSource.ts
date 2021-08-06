import { MutationResolvers } from '~/apollo';
import { db } from '~/db';

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
  await dataSources.gorge.deleteJobForSource(result);
  return result;
};

export default removeSource;
