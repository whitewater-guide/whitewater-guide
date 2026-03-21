import type { Gauge } from '@whitewater-guide/schema';

import type { Context } from '../../apollo/index';
import type { FieldsMap } from '../../db/connectors/index';
import { OffsetConnector } from '../../db/connectors/index';
import type { Sql } from '../../db/index';

const FIELDS_MAP: FieldsMap<Gauge, Sql.GaugesView> = {
  latestMeasurement: ['script', 'code'],
  lastMeasurement: ['script', 'code'],
  status: ['source_id', 'code'],
  source: ['source_id', 'script'],
};

export class GaugesConnector extends OffsetConnector<Gauge, Sql.GaugesView> {
  constructor(context: Context) {
    super(context);
    this._tableName = 'gauges_view';
    this._graphqlTypeName = 'Gauge';
    this._fieldsMap = FIELDS_MAP;
  }
}
