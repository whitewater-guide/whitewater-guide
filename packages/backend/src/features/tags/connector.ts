import { Tag } from '@whitewater-guide/schema';

import { Sql } from '~/db';
import { FieldsMap, OffsetConnector } from '~/db/connectors';

const FIELDS_MAP: FieldsMap<Tag, Sql.TagsView> = {};

export class TagsConnector extends OffsetConnector<Tag, Sql.TagsView> {
  constructor() {
    super();
    this._tableName = 'tags_view';
    this._graphqlTypeName = 'Tag';
    this._fieldsMap = FIELDS_MAP;
    this._orderBy = [{ column: 'name' }];
  }
}
