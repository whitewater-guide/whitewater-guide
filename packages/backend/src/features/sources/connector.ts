import { ContextUser } from '@apollo';
import { BaseModel, FieldsMap } from '@db/model';
import { Source } from '@ww-commons';
import { SourceRaw } from './types';

const FIELDS_MAP: FieldsMap<Source, SourceRaw> = {
  status: 'script',
  gauges: null,
  regions: null,
};

export class SourcesConnector extends BaseModel<Source, SourceRaw> {

  constructor(user: ContextUser | undefined, language: string, fieldsByType: Map<string, Set<string>>) {
    super(user, language, fieldsByType);
    this._tableName = 'sources_view';
    this._graphqlTypeName = 'Source';
    this._fieldsMap = FIELDS_MAP;
  }

}
