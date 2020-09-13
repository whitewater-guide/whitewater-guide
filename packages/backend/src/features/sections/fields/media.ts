import { GraphQLFieldResolver } from 'graphql';

import { Context, ListQuery } from '~/apollo';

import { SectionRaw } from '../types';

const mediaResolver: GraphQLFieldResolver<SectionRaw, Context, ListQuery> = (
  { id },
  { page },
  { dataSources },
  info,
) => dataSources.media.getMany(info, { page, sectionId: id });

export default mediaResolver;
