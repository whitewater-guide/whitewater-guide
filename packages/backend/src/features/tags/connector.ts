import { ContextUser } from '@apollo';
import { BaseModel, FieldsMap } from '@db/model';
import { Tag } from '@ww-commons';
import { TagRaw } from './types';

const FIELDS_MAP: FieldsMap<Tag, TagRaw> = {
};

export class TagsConnector extends BaseModel<Tag, TagRaw> {

  constructor(user: ContextUser | undefined, language: string, fieldsByType: Map<string, Set<string>>) {
    super(user, language, fieldsByType);
    this._tableName = 'tags_view';
    this._graphqlTypeName = 'Tag';
    this._fieldsMap = FIELDS_MAP;
    this._orderBy = [{ column: 'name' }];
  }

}
