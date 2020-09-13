import { JobDescription } from '@whitewater-guide/gorge';
import { GraphQLFieldResolver } from 'graphql';

import { Context } from '~/apollo';

import { SourceRaw } from '../types';

const statusResolver: GraphQLFieldResolver<SourceRaw, Context> = async (
  { id },
  _,
  { dataSources },
) => {
  const jobs: Map<string, JobDescription> = await dataSources.gorge.listJobs();
  const job = jobs.get(id);
  return job?.status;
};

export default statusResolver;
