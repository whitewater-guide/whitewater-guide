import { Tag } from '@whitewater-guide/commons';
import { FieldsMap, OffsetConnector } from '~/db/connectors';
import { TagRaw } from './types';

const FIELDS_MAP: FieldsMap<Tag, TagRaw> = {};

export class TagsConnector extends OffsetConnector<Tag, TagRaw> {
  constructor() {
    super();
    this._tableName = 'tags_view';
    this._graphqlTypeName = 'Tag';
    this._fieldsMap = FIELDS_MAP;
    this._orderBy = [{ column: 'name' }];
  }
}
