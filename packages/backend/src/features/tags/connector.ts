import { BaseConnector, FieldsMap } from '@db/connectors';
import { Tag } from '@ww-commons';
import { TagRaw } from './types';

const FIELDS_MAP: FieldsMap<Tag, TagRaw> = {
};

export class TagsConnector extends BaseConnector<Tag, TagRaw> {

  constructor() {
    super();
    this._tableName = 'tags_view';
    this._graphqlTypeName = 'Tag';
    this._fieldsMap = FIELDS_MAP;
    this._orderBy = [{ column: 'name' }];
  }

}
