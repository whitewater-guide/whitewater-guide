import { Context } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { RiverRaw } from '../types';

const regionResolver: GraphQLFieldResolver<RiverRaw, Context> =
  ({ region_id }, _, { models }) => models.regions.getById(region_id);

export default regionResolver;
