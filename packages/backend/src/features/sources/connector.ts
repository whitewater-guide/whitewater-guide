import { Source } from '@whitewater-guide/schema';

import { Sql } from '~/db';
import { FieldsMap, OffsetConnector } from '~/db/connectors';

const FIELDS_MAP: FieldsMap<Source, Sql.SourcesView> = {
  status: 'script',
  enabled: null,
  gauges: null,
  regions: null,
};

export class SourcesConnector extends OffsetConnector<Source, Sql.SourcesView> {
  constructor() {
    super();
    this._tableName = 'sources_view';
    this._graphqlTypeName = 'Source';
    this._fieldsMap = FIELDS_MAP;
  }
}
