import { TopLevelResolver } from '~/apollo';
import db from '~/db';

interface Vars {
  id: string;
}

const removeSource: TopLevelResolver<Vars> = async (
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
