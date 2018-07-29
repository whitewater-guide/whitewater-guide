import { Context, ListQuery } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { RegionRaw } from '../types';

const sectionsResolver: GraphQLFieldResolver<RegionRaw, Context, ListQuery> =
  async ({ id }, { page }, { models }, info) =>
    models.sections.getMany(info, { page, filter: { regionId: id } });

export default sectionsResolver;
