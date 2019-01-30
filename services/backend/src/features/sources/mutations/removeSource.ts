import { TopLevelResolver } from '@apollo';
import db from '@db';
import { stopJobs } from '@features/jobs';

interface Vars {
  id: string;
}

const removeSource: TopLevelResolver<Vars> = async (root, { id }) => {
  const [result] = await db()
    .table('sources')
    .del()
    .where({ id })
    .returning('id');
  stopJobs(result);
  return result;
};

export default removeSource;
