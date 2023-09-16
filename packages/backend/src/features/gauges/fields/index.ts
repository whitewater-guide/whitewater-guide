import type { GaugeResolvers } from '../../../apollo/index';
import { timestampedResolvers } from '../../../apollo/index';
import latestMeasurement from './latestMeasurement';
import status from './status';

const resolvers: GaugeResolvers = {
  levelUnit: (gauge) => gauge.level_unit,
  flowUnit: (gauge) => gauge.flow_unit,
  latestMeasurement,
  lastMeasurement: latestMeasurement,
  status,
  requestParams: (gauge) => gauge.request_params,
  source: async ({ source_id }, _, { dataSources }) => {
    const src = await dataSources.sources.getById(source_id);
    return src!;
  },
  ...timestampedResolvers,
};

export default resolvers;
