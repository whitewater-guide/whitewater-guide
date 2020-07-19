import { Gauge } from '@whitewater-guide/commons';
import { FieldsMap, OffsetConnector } from '~/db/connectors';
import { GaugeRaw } from './types';

const FIELDS_MAP: FieldsMap<Gauge, GaugeRaw> = {
  latestMeasurement: ['script', 'code'],
  lastMeasurement: ['script', 'code'],
  status: ['source_id', 'code'],
  source: ['source_id', 'script'],
};

export class GaugesConnector extends OffsetConnector<Gauge, GaugeRaw> {
  constructor() {
    super();
    this._tableName = 'gauges_view';
    this._graphqlTypeName = 'Gauge';
    this._fieldsMap = FIELDS_MAP;
  }
}
