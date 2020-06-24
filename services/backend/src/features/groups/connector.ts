import { BaseConnector, FieldsMap, ManyBuilderOptions } from '~/db/connectors';
import { Group } from '@whitewater-guide/commons';
import { GraphQLResolveInfo } from 'graphql';
import { QueryBuilder } from 'knex';
import { GroupRaw } from './types';

const FIELDS_MAP: FieldsMap<Group, GroupRaw> = {
  regions: null,
};

interface GetManyOptions extends ManyBuilderOptions<GroupRaw> {
  regionId?: string;
}

export class GroupsConnector extends BaseConnector<Group, GroupRaw> {
  constructor() {
    super();
    this._tableName = 'groups_view';
    this._graphqlTypeName = 'Group';
    this._fieldsMap = FIELDS_MAP;
    this._orderBy = [{ column: 'name' }];
  }

  getMany(
    info: GraphQLResolveInfo,
    { regionId, ...options }: GetManyOptions = {},
  ) {
    const query = super.getMany(info, options);
    if (regionId) {
      query.whereExists(function(this: QueryBuilder) {
        this.select('*')
          .from('regions_groups')
          .where('regions_groups.region_id', regionId)
          .whereRaw('regions_groups.group_id = groups_view.id');
      });
    }
    return query;
  }
}
