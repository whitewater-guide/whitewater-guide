import { GaugeResolvers, timestampedResolvers } from '~/apollo';

import latestMeasurement from './latestMeasurement';
import status from './status';

const resolvers: GaugeResolvers = {
  levelUnit: (gauge) => gauge.level_unit,
  flowUnit: (gauge) => gauge.flow_unit,
  latestMeasurement,
  lastMeasurement: latestMeasurement,
  status,
  requestParams: (gauge) => gauge.request_params,
  source: ({ source_id }, _, { dataSources }) =>
    dataSources.sources.getById(source_id),
  ...timestampedResolvers,
};

export default resolvers;
