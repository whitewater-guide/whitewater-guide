import { GraphQLFieldResolver } from 'graphql';
import { Context } from '../../../apollo';
import { LastOpNS, redis } from '../../../redis';
import { GaugeRaw } from '../types';

const statusResolver: GraphQLFieldResolver<GaugeRaw, Context> = async ({ script, code }) => {
  // TODO: extract redis cache api, use data loaders (this is admin part and not critical)
  const statusStr = await redis.hget(`${LastOpNS}:${script}`, code);
  return JSON.parse(statusStr);
};

export default statusResolver;
