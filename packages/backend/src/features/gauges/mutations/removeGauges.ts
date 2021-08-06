import { Node } from '@whitewater-guide/schema';

import { MutationResolvers } from '~/apollo';
import { db } from '~/db';

const removeGauges: MutationResolvers['removeGauges'] = async (
  _,
  { sourceId },
  { dataSources },
) => {
  const result: Node[] = await db()
    .table('gauges')
    .del()
    .where({ source_id: sourceId })
    .returning(['id']);
  await dataSources.gorge.deleteJobForSource(sourceId);
  return result.map(({ id }) => id);
};

export default removeGauges;
