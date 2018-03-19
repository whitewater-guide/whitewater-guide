import { FieldResolvers } from '../../../apollo';
import { timestampResolvers } from '../../../db';
import { Gauge } from '../../../ww-commons';
import { GaugeRaw } from '../types';
import lastMeasurement from './lastMeasurement';
import status from './status';

const resolvers: FieldResolvers<GaugeRaw, Gauge> = {
  levelUnit: gauge => gauge.level_unit,
  flowUnit: gauge => gauge.flow_unit,
  lastMeasurement,
  status,
  requestParams: gauge => gauge.request_params,
  ...timestampResolvers,
};

export default resolvers;
