import type { Source } from '@whitewater-guide/schema';

import type { Context } from '../../apollo/index';
import type { FieldsMap } from '../../db/connectors/index';
import { OffsetConnector } from '../../db/connectors/index';
import type { Sql } from '../../db/index';

const FIELDS_MAP: FieldsMap<Source, Sql.SourcesView> = {
  status: 'script',
  enabled: null,
  gauges: null,
  regions: null,
};

export class SourcesConnector extends OffsetConnector<Source, Sql.SourcesView> {
  constructor(context: Context) {
    super(context);
    this._tableName = 'sources_view';
    this._graphqlTypeName = 'Source';
    this._fieldsMap = FIELDS_MAP;
  }
}
