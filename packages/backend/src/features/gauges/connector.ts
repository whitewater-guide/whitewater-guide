import { ContextUser } from '@apollo';
import { BaseModel, FieldsMap } from '@db/model';
import { Gauge } from '@ww-commons';
import { redis } from '../../redis/client';
import { NS_LAST_OP } from '../../redis/constants';
import { GaugeRaw } from './types';

const FIELDS_MAP: FieldsMap<Gauge, GaugeRaw> = {
  lastMeasurement: 'script',
  status: ['source_id', 'script'],
  source: ['source_id', 'script'],
};

export class GaugesConnector extends BaseModel<Gauge, GaugeRaw> {

  constructor(user: ContextUser | undefined, language: string, fieldsByType: Map<string, Set<string>>) {
    super(user, language, fieldsByType);
    this._tableName = 'gauges_view';
    this._graphqlTypeName = 'Gauge';
    this._fieldsMap = FIELDS_MAP;
  }

  async getStatus(script: string, code: string) {
    try {
      const statusStr = await redis.hget(`${NS_LAST_OP}:${script}`, code);
      return JSON.parse(statusStr);
    } catch {
      return null;
    }
  }

}
