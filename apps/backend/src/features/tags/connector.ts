import type { Tag } from '@whitewater-guide/schema';

import type { Context } from '../../apollo/index';
import type { FieldsMap } from '../../db/connectors/index';
import { OffsetConnector } from '../../db/connectors/index';
import type { Sql } from '../../db/index';

const FIELDS_MAP: FieldsMap<Tag, Sql.TagsView> = {};

export class TagsConnector extends OffsetConnector<Tag, Sql.TagsView> {
  constructor(context: Context) {
    super(context);
    this._tableName = 'tags_view';
    this._graphqlTypeName = 'Tag';
    this._fieldsMap = FIELDS_MAP;
    this._orderBy = [{ column: 'name' }];
  }
}
