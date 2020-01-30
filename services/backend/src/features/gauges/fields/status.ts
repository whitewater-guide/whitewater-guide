import { Context } from '@apollo';
import { GorgeStatus } from '@features/gorge';
import { GraphQLFieldResolver } from 'graphql';
import { GaugeRaw } from '../types';

const statusResolver: GraphQLFieldResolver<GaugeRaw, Context> = async (
  { code, source_id },
  _,
  { dataSources },
) => {
  const statuses: Map<
    string,
    GorgeStatus
  > = await dataSources.gorge.getGaugeStatuses(source_id);
  return statuses.get(code) || null;
};

export default statusResolver;
