import { River } from '@whitewater-guide/schema';

import { Sql } from '~/db';
import { FieldsMap, OffsetConnector } from '~/db/connectors';

const FIELDS_MAP: FieldsMap<River, Sql.RiversView> = {
  region: 'region_id',
  sections: null,
};

export class RiversConnector extends OffsetConnector<River, Sql.RiversView> {
  constructor() {
    super();
    this._tableName = 'rivers_view';
    this._graphqlTypeName = 'River';
    this._fieldsMap = FIELDS_MAP;
  }
}
