import { TopLevelResolver } from '@apollo';
import db from '@db';
import { Node } from '@whitewater-guide/commons';

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
