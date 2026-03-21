import type { River } from '@whitewater-guide/schema';

import type { Context } from '../../apollo/index';
import type { FieldsMap } from '../../db/connectors/index';
import { OffsetConnector } from '../../db/connectors/index';
import type { Sql } from '../../db/index';

const FIELDS_MAP: FieldsMap<River, Sql.RiversView> = {
  region: 'region_id',
  sections: null,
};

export class RiversConnector extends OffsetConnector<River, Sql.RiversView> {
  constructor(context: Context) {
    super(context);
    this._tableName = 'rivers_view';
    this._graphqlTypeName = 'River';
    this._fieldsMap = FIELDS_MAP;
  }
}
