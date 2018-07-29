import { Context } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { SectionRaw } from '../types';

const riverResolver: GraphQLFieldResolver<SectionRaw, Context> =
  ({ river_id }, _, { models }) => models.rivers.getById(river_id);

export default riverResolver;
