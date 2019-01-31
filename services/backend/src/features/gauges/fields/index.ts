import { FieldResolvers } from '@apollo';
import { timestampResolvers } from '@db';
import { Gauge } from '@whitewater-guide/commons';
import { GaugeRaw } from '../types';
import lastMeasurement from './lastMeasurement';
import status from './status';

const resolvers: FieldResolvers<GaugeRaw, Gauge> = {
  levelUnit: (gauge) => gauge.level_unit,
  flowUnit: (gauge) => gauge.flow_unit,
  lastMeasurement,
  status,
  requestParams: (gauge) => gauge.request_params,
  source: ({ source_id }, _, { dataSources }) =>
    dataSources.sources.getById(source_id),
  ...timestampResolvers,
};

export default resolvers;