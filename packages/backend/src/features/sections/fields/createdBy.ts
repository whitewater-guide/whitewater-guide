import { GraphQLFieldResolver } from 'graphql';

import { Context } from '~/apollo';

import { SectionRaw } from '../types';

const createdByResolver: GraphQLFieldResolver<SectionRaw, Context> = (
  { created_by },
  _,
  { dataSources },
) => {
  return dataSources.users.getById(created_by);
};

export default createdByResolver;
