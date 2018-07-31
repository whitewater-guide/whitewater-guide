import { Context } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { GaugeRaw } from '../types';

const lastMeasurementResolver: GraphQLFieldResolver<GaugeRaw, Context> = ({ script, code }, args, { models }) =>
  models.measurements.getLastMeasurement(script, code);

export default lastMeasurementResolver;
