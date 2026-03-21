import type { Suggestion } from '@whitewater-guide/schema';

import type { Context } from '../../apollo/index';
import type { FieldsMap } from '../../db/connectors/index';
import { OffsetConnector } from '../../db/connectors/index';
import type { Sql } from '../../db/index';

const FIELDS_MAP: FieldsMap<Suggestion, Sql.Suggestions> = {
  section: 'section_id',
  image: 'filename',
};

export class SuggestionsConnector extends OffsetConnector<
  Suggestion,
  Sql.Suggestions
> {
  constructor(context: Context) {
    super(context);
    this._tableName = 'suggestions';
    this._graphqlTypeName = 'Suggestion';
    this._fieldsMap = FIELDS_MAP;
    this._orderBy = [
      { column: 'created_at', direction: 'desc' },
      { column: 'id', direction: 'asc' },
    ];
    this._language = undefined;
  }
}
