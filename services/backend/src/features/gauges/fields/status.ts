import { Context } from '@apollo';
import { GaugeRaw } from '../types';
import { GraphQLFieldResolver } from 'graphql';
import { Status } from '@whitewater-guide/gorge';

const statusResolver: GraphQLFieldResolver<GaugeRaw, Context> = async (
  { code, source_id },
  _,
  { dataSources },
) => {
  const statuses: Map<
    string,
    Status
  > = await dataSources.gorge.getGaugeStatuses(source_id);
  return statuses.get(code) || null;
};

export default statusResolver;
