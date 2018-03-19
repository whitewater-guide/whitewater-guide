import { GraphQLFieldResolver } from 'graphql';
import { Context } from '../../../apollo';
import { LastMeasurementsNs, redis } from '../../../redis';
import { GaugeRaw } from '../types';

const lastMeasurementResolver: GraphQLFieldResolver<GaugeRaw, Context> = async ({ script, code }) => {
  // TODO: extract redis cache api, use data loaders (this is admin part and not critical)
  const lastMeasurementStr = await redis.hget(`${LastMeasurementsNs}:${script}`, code);
  return JSON.parse(lastMeasurementStr);
};

export default lastMeasurementResolver;
