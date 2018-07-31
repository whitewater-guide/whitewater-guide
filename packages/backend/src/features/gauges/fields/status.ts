import { Context } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { GaugeRaw } from '../types';

const statusResolver: GraphQLFieldResolver<GaugeRaw, Context> = ({ script, code }, _, { dataSources }) =>
  dataSources.gauges.getStatus(script, code);

export default statusResolver;
