import { Context } from '@apollo';
import { HarvestMode } from '@ww-commons';
import { GraphQLFieldResolver } from 'graphql';
import { SourceRaw } from '../types';

const statusResolver: GraphQLFieldResolver<SourceRaw, Context> = async ({ script, harvest_mode }, _, { models }) => {
  if (harvest_mode === HarvestMode.ONE_BY_ONE) {
    return null;
  }
  return models.sources.getStatus(script);
};

export default statusResolver;
