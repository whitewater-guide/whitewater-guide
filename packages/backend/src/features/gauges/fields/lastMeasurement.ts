import { GraphQLFieldResolver } from 'graphql';
import { Context } from '../../../apollo';
import { GaugeRaw } from '../types';

const lastMeasurementResolver: GraphQLFieldResolver<GaugeRaw, Context> = ({ script, code }, args, ctx) =>
  ctx.lastMeasurementLoader.loadByGauge(script, code);

export default lastMeasurementResolver;
