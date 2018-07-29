import { Context, ListQuery } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { RiverRaw } from '../types';

const sectionsResolver: GraphQLFieldResolver<RiverRaw, Context, ListQuery> =
  async ({ id }, { page }, { models }, info) =>
    models.sections.getMany(info, { page, filter: { riverId: id } });

export default sectionsResolver;
