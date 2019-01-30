import { Context } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { RiverRaw } from '../types';

const regionResolver: GraphQLFieldResolver<RiverRaw, Context> = (
  { region_id },
  _,
  { dataSources },
) => dataSources.regions.getById(region_id);

export default regionResolver;
