import { Suggestion } from '@whitewater-guide/schema';
import { DataSourceConfig } from 'apollo-datasource';

import { Context } from '~/apollo';
import { Sql } from '~/db';
import { FieldsMap, OffsetConnector } from '~/db/connectors';

const FIELDS_MAP: FieldsMap<Suggestion, Sql.Suggestions> = {
  section: 'section_id',
  image: 'filename',
};

export class SuggestionsConnector extends OffsetConnector<
  Suggestion,
  Sql.Suggestions
> {
  constructor() {
    super();
    this._tableName = 'suggestions';
    this._graphqlTypeName = 'Suggestion';
    this._fieldsMap = FIELDS_MAP;
    this._orderBy = [
      { column: 'created_at', direction: 'desc' },
      { column: 'id', direction: 'asc' },
    ];
  }

  initialize(config: DataSourceConfig<Context>) {
    super.initialize(config);
    this._language = undefined;
  }
}
