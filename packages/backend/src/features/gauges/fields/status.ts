import type { Status } from '@whitewater-guide/gorge';

import type { GaugeResolvers } from '../../../apollo/index';

const statusResolver: GaugeResolvers['status'] = async (
  { code, source_id },
  _,
  { dataSources },
) => {
  const statuses: Map<string, Status> =
    await dataSources.gorge.getGaugeStatuses(source_id);
  return statuses.get(code) || null;
};

export default statusResolver;
