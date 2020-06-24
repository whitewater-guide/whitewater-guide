import { BaseConnector, FieldsMap } from '~/db/connectors';
import { Gauge } from '@whitewater-guide/commons';
import { GaugeRaw } from './types';

const FIELDS_MAP: FieldsMap<Gauge, GaugeRaw> = {
  latestMeasurement: ['script', 'code'],
  lastMeasurement: ['script', 'code'],
  status: ['source_id', 'code'],
  source: ['source_id', 'script'],
};

export class GaugesConnector extends BaseConnector<Gauge, GaugeRaw> {
  constructor() {
    super();
    this._tableName = 'gauges_view';
    this._graphqlTypeName = 'Gauge';
    this._fieldsMap = FIELDS_MAP;
  }
}
