import { GraphQLFieldResolver } from 'graphql';
import { baseResolver } from '../../../apollo';
import db from '../../../db';
import { stopJobs } from '../../jobs';

interface Vars {
  id: string;
}

const resolver: GraphQLFieldResolver<any, any> = async (root, { id }: Vars) => {
  const [result] = await db().table('sources').del().where({ id }).returning('id');
  stopJobs(result);
  return result;
};

const removeSource = baseResolver.createResolver(
  resolver,
);

export default removeSource;
