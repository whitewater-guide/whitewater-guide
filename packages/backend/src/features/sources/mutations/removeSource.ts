import { baseResolver, TopLevelResolver } from '../../../apollo';
import db from '../../../db';
import { stopJobs } from '../../jobs';

interface Vars {
  id: string;
}

const resolver: TopLevelResolver<Vars> = async (root, { id }) => {
  const [result] = await db().table('sources').del().where({ id }).returning('id');
  stopJobs(result);
  return result;
};

const removeSource = baseResolver.createResolver(
  resolver,
);

export default removeSource;
