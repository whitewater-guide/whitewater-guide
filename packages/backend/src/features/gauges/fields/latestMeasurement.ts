import { GraphQLFieldResolver } from 'graphql';

import { Context } from '~/apollo';

import { GaugeRaw } from '../types';

const latestMeasurementResolver: GraphQLFieldResolver<GaugeRaw, Context> = (
  { script, code },
  _,
  { dataSources },
) => dataSources.gorge.getLatest(script, code);

export default latestMeasurementResolver;
