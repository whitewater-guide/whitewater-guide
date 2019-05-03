import { TopLevelResolver } from '@apollo';
import db from '@db';
import { stopJobs } from '@features/jobs';
import { Node } from '@whitewater-guide/commons';

interface Vars {
  sourceId: string;
}

const removeGauges: TopLevelResolver<Vars> = async (root, { sourceId }) => {
  const result: Node[] = await db()
    .table('gauges')
    .del()
    .where({ source_id: sourceId })
    .returning(['id']);
  stopJobs(sourceId);
  return result.map(({ id }) => id);
};

export default removeGauges;
