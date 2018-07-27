import { Context } from '@apollo';
import { getLastStatus } from '@redis';
import { HarvestMode } from '@ww-commons';
import { GraphQLFieldResolver } from 'graphql';
import { GaugeRaw } from '../types';

const statusResolver: GraphQLFieldResolver<GaugeRaw, Context> = async ({ source, code }) => {
  // TODO: extract redis cache api, use data loaders (this is admin part and not critical)
  if (source.harvest_mode === HarvestMode.ALL_AT_ONCE) {
    return null;
  }
  return getLastStatus(source.script, code);
};

export default statusResolver;
