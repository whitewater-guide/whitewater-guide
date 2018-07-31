import { Context } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { GaugeRaw } from '../types';

const lastMeasurementResolver: GraphQLFieldResolver<GaugeRaw, Context> = ({ script, code }, args, { dataSources }) =>
  dataSources.measurements.getLastMeasurement(script, code);

export default lastMeasurementResolver;
