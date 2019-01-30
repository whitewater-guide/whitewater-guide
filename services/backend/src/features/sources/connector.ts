import { BaseConnector, FieldsMap } from '@db/connectors';
import { asyncRedis, NS_LAST_OP } from '@redis';
import { Source } from '@whitewater-guide/commons';
import { SourceRaw } from './types';

const FIELDS_MAP: FieldsMap<Source, SourceRaw> = {
  status: 'script',
  gauges: null,
  regions: null,
};

export class SourcesConnector extends BaseConnector<Source, SourceRaw> {
  constructor() {
    super();
    this._tableName = 'sources_view';
    this._graphqlTypeName = 'Source';
    this._fieldsMap = FIELDS_MAP;
  }

  async getStatus(script: string) {
    try {
      const statusStr = await asyncRedis.get(`${NS_LAST_OP}:${script}`);
      return JSON.parse(statusStr);
    } catch (e) {
      return null;
    }
  }
}
