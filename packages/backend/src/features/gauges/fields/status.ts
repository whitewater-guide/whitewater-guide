import { GraphQLFieldResolver } from 'graphql';
import { Context } from '../../../apollo';
import log from '../../../log';
import { LastOpNS, redis } from '../../../redis';
import { HarvestMode } from '../../../ww-commons';
import { GaugeRaw } from '../types';

const statusResolver: GraphQLFieldResolver<GaugeRaw, Context> = async ({ source, code }) => {
  // TODO: extract redis cache api, use data loaders (this is admin part and not critical)
  if (source.harvest_mode === HarvestMode.ALL_AT_ONCE) {
    return null;
  }
  try {
    const statusStr = await redis.hget(`${LastOpNS}:${source.script}`, code);
    return JSON.parse(statusStr);
  } catch (err) {
    log.error(`gauge status resolver failed: ${err}`);
    return null;
  }
};

export default statusResolver;
