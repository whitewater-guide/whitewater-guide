import { Context } from '~/apollo';
import { GraphQLFieldResolver } from 'graphql';
import { SectionRaw } from '../types';

const gaugeResolver: GraphQLFieldResolver<SectionRaw, Context> = (
  { gauge_id },
  _,
  { dataSources },
) => dataSources.gauges.getById(gauge_id);

export default gaugeResolver;
