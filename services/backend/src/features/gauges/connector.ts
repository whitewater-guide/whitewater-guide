import { BaseConnector, FieldsMap } from '@db/connectors';
import { NS_LAST_OP, redis } from '@redis';
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
      const statusStr = await redis.hget(`${NS_LAST_OP}:${script}`, code);
      return statusStr ? JSON.parse(statusStr) : null;
    } catch {
      return null;
    }
  }
}
