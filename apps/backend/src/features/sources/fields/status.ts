import type { JobDescription } from '@whitewater-guide/gorge';

import type { SourceResolvers } from '../../../apollo/index';

const statusResolver: SourceResolvers['status'] = async (
  { id },
  _,
  { dataSources },
) => {
  const jobs: Map<string, JobDescription> = await dataSources.gorge.listJobs();
  const job = jobs.get(id);
  return job?.status;
};

export default statusResolver;
