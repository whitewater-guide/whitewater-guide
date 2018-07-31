import { TopLevelResolver } from '@apollo';
import db from '@db';
import { stopJobs } from '@features/jobs';

interface Vars {
  id: string;
}

const removeGauge: TopLevelResolver<Vars> = async (root, { id }) => {
  const [result] = await db().table('gauges').del().where({ id }).returning(['id', 'source_id']);
  stopJobs(result.source_id, result.id);
  return result.id;
};

export default removeGauge;
