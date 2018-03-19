import { GraphQLFieldResolver } from 'graphql';
import { Context } from '../../../apollo';
import { getLastStatus } from '../../../redis';
import { HarvestMode } from '../../../ww-commons';
import { SourceRaw } from '../types';

const statusResolver: GraphQLFieldResolver<SourceRaw, Context> = async ({ script, harvest_mode }) => {
  if (harvest_mode === HarvestMode.ONE_BY_ONE) {
    return null;
  }
  return getLastStatus(script);
};

export default statusResolver;
