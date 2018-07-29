import { Context, ListQuery } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { RegionRaw } from '../types';

const riversResolver: GraphQLFieldResolver<RegionRaw, Context, ListQuery> =
  async ({ id }, { page }, { models }, info) =>
    models.rivers.getMany(info, { page, where: { region_id: id } });

export default riversResolver;
