import { Group } from '@whitewater-guide/schema';
import { GraphQLResolveInfo } from 'graphql';
import { QueryBuilder } from 'knex';

import { Sql } from '~/db';
import {
  FieldsMap,
  ManyBuilderOptions,
  OffsetConnector,
} from '~/db/connectors';

const FIELDS_MAP: FieldsMap<Group, Sql.GroupsView> = {
  regions: null,
};

interface GetManyOptions extends ManyBuilderOptions<Sql.GroupsView> {
  regionId?: string;
}

export class GroupsConnector extends OffsetConnector<Group, Sql.GroupsView> {
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
      query.whereExists(function (this: QueryBuilder) {
        this.select('*')
          .from('regions_groups')
          .where('regions_groups.region_id', regionId)
          .whereRaw('regions_groups.group_id = groups_view.id');
      });
    }
    return query;
  }
}
