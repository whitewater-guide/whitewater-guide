import { GraphQLFieldResolver } from 'graphql';
import { baseResolver } from '../../../apollo';
import db from '../../../db';
import { stopJobs } from '../../jobs';

interface RemoveVariables {
  id: string;
}

const resolver: GraphQLFieldResolver<any, any> = async (root, { id }: RemoveVariables) => {
  const [result] = await db().table('gauges').del().where({ id }).returning(['id', 'source_id']);
  stopJobs(result.source_id, result.id);
  return result.id;
};

const removeGauge = baseResolver.createResolver(
  resolver,
);

export default removeGauge;
