import { BaseConnector, FieldsMap } from '@db/connectors';
import { asyncRedis, NS_LAST_OP } from '@redis';
import { Gauge } from '@whitewater-guide/commons';
import { GaugeRaw } from './types';

const FIELDS_MAP: FieldsMap<Gauge, GaugeRaw> = {
  lastMeasurement: ['script', 'code'],
  status: ['source_id', 'script'],
  source: ['source_id', 'script'],
};

export class GaugesConnector extends BaseConnector<Gauge, GaugeRaw> {
  constructor() {
    super();
    this._tableName = 'gauges_view';
    this._graphqlTypeName = 'Gauge';
    this._fieldsMap = FIELDS_MAP;
  }

  async getStatus(script: string, code: string) {
    try {
      const statusStr = await asyncRedis.hget(`${NS_LAST_OP}:${script}`, code);
      return JSON.parse(statusStr);
    } catch {
      return null;
    }
  }
}
