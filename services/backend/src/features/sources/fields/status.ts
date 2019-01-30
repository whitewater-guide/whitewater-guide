import { Context } from '@apollo';
import { HarvestMode } from '@whitewater-guide/commons';
import { GraphQLFieldResolver } from 'graphql';
import { SourceRaw } from '../types';

const statusResolver: GraphQLFieldResolver<SourceRaw, Context> = async (
  { script, harvest_mode },
  _,
  { dataSources },
) => {
  if (harvest_mode === HarvestMode.ONE_BY_ONE) {
    return null;
  }
  return dataSources.sources.getStatus(script);
};

export default statusResolver;
