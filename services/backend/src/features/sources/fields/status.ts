import { Context } from '@apollo';
import { GorgeJob } from '@features/gorge';
import { GraphQLFieldResolver } from 'graphql';
import { SourceRaw } from '../types';

const statusResolver: GraphQLFieldResolver<SourceRaw, Context> = async (
  { id },
  _,
  { dataSources },
) => {
  const jobs: Map<string, GorgeJob> = await dataSources.gorge.listJobs();
  const job = jobs.get(id);
  return job?.status;
};

export default statusResolver;
