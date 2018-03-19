import { GraphQLFieldResolver } from 'graphql';
import { Context } from '../../../apollo';
import { LastOpNS, redis } from '../../../redis';
import { HarvestMode } from '../../../ww-commons';
import { GaugeRaw } from '../types';

const statusResolver: GraphQLFieldResolver<GaugeRaw, Context> = async ({ source, code }) => {
  // TODO: extract redis cache api, use data loaders (this is admin part and not critical)
  if (source.harvest_mode === HarvestMode.ALL_AT_ONCE) {
    return null;
  }
  const statusStr = await redis.hget(`${LastOpNS}:${source.script}`, code);
  return JSON.parse(statusStr);
};

export default statusResolver;
