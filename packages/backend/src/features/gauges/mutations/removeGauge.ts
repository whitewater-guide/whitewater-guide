import { MutationResolvers } from '~/apollo';
import { db } from '~/db';

const removeGauge: MutationResolvers['removeGauge'] = async (
  _,
  { id },
  { dataSources },
) => {
  const [result]: any[] = await db()
    .table('gauges')
    .del()
    .where({ id })
    .returning(['id', 'source_id']);
  await dataSources.gorge.updateJobForSource(result.source_id);
  return result.id;
};

export default removeGauge;
