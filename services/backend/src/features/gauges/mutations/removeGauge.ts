import { TopLevelResolver } from '~/apollo';
import db from '~/db';

interface Vars {
  id: string;
}

const removeGauge: TopLevelResolver<Vars> = async (
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
