import type { Group } from '@whitewater-guide/schema';
import type { GraphQLResolveInfo } from 'graphql';
import type { Knex } from 'knex';

import type { Context } from '../../apollo/index';
import type { FieldsMap, ManyBuilderOptions } from '../../db/connectors/index';
import { OffsetConnector } from '../../db/connectors/index';
import type { Sql } from '../../db/index';

const FIELDS_MAP: FieldsMap<Group, Sql.GroupsView> = {
  regions: null,
};

interface GetManyOptions extends ManyBuilderOptions<Sql.GroupsView> {
  regionId?: string | null;
}

export class GroupsConnector extends OffsetConnector<Group, Sql.GroupsView> {
  constructor(context: Context) {
    super(context);
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
      query.whereExists(function (this: Knex.QueryBuilder) {
        this.select('*')
          .from('regions_groups')
          .where('regions_groups.region_id', regionId)
          .whereRaw('regions_groups.group_id = groups_view.id');
      });
    }
    return query;
  }
}
