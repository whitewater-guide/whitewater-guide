import { Node } from '@whitewater-guide/commons';

import { TopLevelResolver } from '~/apollo';
import db from '~/db';

interface Vars {
  sourceId: string;
}

const removeGauges: TopLevelResolver<Vars> = async (
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
