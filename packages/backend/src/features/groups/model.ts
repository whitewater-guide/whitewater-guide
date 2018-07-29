import { ContextUser } from '@apollo';
import { BaseModel, FieldsMap, ManyBuilderOptions } from '@db/model';
import { Group } from '@ww-commons';
import { GraphQLResolveInfo } from 'graphql';
import { QueryBuilder } from 'knex';
import { GroupRaw } from './types';

const FIELDS_MAP: FieldsMap<Group, GroupRaw> = {
  regions: null,
};

interface GetManyOptions extends ManyBuilderOptions<GroupRaw> {
  regionId?: string;
}

export class Groups extends BaseModel<Group, GroupRaw> {

  constructor(user: ContextUser | undefined, language: string, fieldsByType: Map<string, Set<string>>) {
    super(user, language, fieldsByType);
    this._tableName = 'groups_view';
    this._graphqlTypeName = 'Group';
    this._fieldsMap = FIELDS_MAP;
  }

  getMany(info: GraphQLResolveInfo, { regionId, ...options }: GetManyOptions) {
    const query = super.getMany(info, { ...options, orderBy: [{ column: 'name' }] });
    if (regionId) {
      query.whereExists(function(this: QueryBuilder) {
        this.select('*').from('regions_groups')
          .where('regions_groups.region_id', regionId)
          .whereRaw('regions_groups.group_id = groups_view.id');
      });
    }
    return query;
  }

}
