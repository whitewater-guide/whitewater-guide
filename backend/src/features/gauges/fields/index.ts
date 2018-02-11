import { Geometry, Point, Polygon } from 'wkx';
import { FieldResolvers } from '../../../apollo';
import { timestampResolvers } from '../../../db';
import { Gauge } from '../../../ww-commons';
import { GaugeRaw } from '../types';

const resolvers: FieldResolvers<GaugeRaw, Gauge> = {
  levelUnit: gauge => gauge.level_unit,
  flowUnit: gauge => gauge.flow_unit,
  lastFlow: gauge => gauge.last_flow || null, // TODO: redis
  lastLevel: gauge => gauge.last_level || null,
  lastTimestamp: gauge => gauge.last_timestamp || null,
  requestParams: gauge => gauge.request_params,
  ...timestampResolvers,
};

export default resolvers;
