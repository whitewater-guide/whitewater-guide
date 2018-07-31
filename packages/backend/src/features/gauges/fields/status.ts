import { Context } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { GaugeRaw } from '../types';

const statusResolver: GraphQLFieldResolver<GaugeRaw, Context> = ({ script, code }, _, { models }) =>
  models.gauges.getStatus(script, code);

export default statusResolver;
