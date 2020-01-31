import { Context } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { SourceRaw } from '../types';

const sourceEnabledResolver: GraphQLFieldResolver<SourceRaw, Context> = async (
  { id },
  _,
  { dataSources },
) => {
  return dataSources.gorge.isSourceEnabled(id);
};

export default sourceEnabledResolver;
