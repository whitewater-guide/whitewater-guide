import { Context } from '~/apollo';
import { BaseConnector, FieldsMap } from '~/db/connectors';
import { Suggestion } from '@whitewater-guide/commons';
import { DataSourceConfig } from 'apollo-datasource';
import { SuggestionRaw } from './types';

const FIELDS_MAP: FieldsMap<Suggestion, SuggestionRaw> = {
  section: 'section_id',
  image: 'filename',
};

export class SuggestionsConnector extends BaseConnector<
  Suggestion,
  SuggestionRaw
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
