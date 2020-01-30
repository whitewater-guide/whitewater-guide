import { Context } from '@apollo';
import { GorgeJob } from '@features/gorge';
import { GraphQLFieldResolver } from 'graphql';
import { SourceRaw } from '../types';

const sourceEnabledResolver: GraphQLFieldResolver<SourceRaw, Context> = async (
  { id },
  _,
  { dataSources },
) => {
  const jobs: Map<string, GorgeJob> = await dataSources.gorge.listJobs();
  return jobs.has(id);
};

export default sourceEnabledResolver;
