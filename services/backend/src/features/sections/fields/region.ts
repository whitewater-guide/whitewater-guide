import { Context } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { SectionRaw } from '../types';

const regionResolver: GraphQLFieldResolver<SectionRaw, Context> = (
  { region_id },
  _,
  { dataSources },
) => dataSources.regions.getById(region_id);

export default regionResolver;
