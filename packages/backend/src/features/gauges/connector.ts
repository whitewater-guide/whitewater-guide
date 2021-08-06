import { Gauge } from '@whitewater-guide/schema';

import { Sql } from '~/db';
import { FieldsMap, OffsetConnector } from '~/db/connectors';

const FIELDS_MAP: FieldsMap<Gauge, Sql.GaugesView> = {
  latestMeasurement: ['script', 'code'],
  lastMeasurement: ['script', 'code'],
  status: ['source_id', 'code'],
  source: ['source_id', 'script'],
};

export class GaugesConnector extends OffsetConnector<Gauge, Sql.GaugesView> {
  constructor() {
    super();
    this._tableName = 'gauges_view';
    this._graphqlTypeName = 'Gauge';
    this._fieldsMap = FIELDS_MAP;
  }
}
