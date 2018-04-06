import Knex from 'knex';
import db, { buildRootQuery, QueryBuilderOptions } from '../../db';
import { Group } from '../../ww-commons';

const connections = {
  regions: {
    getBuilder: () => require('../regions').buildRegionQuery,
    join: (table: string, query: Knex.QueryBuilder) => {
      const groupId = db(true).raw('??', ['groups_view.id']);
      return query
        .innerJoin('regions_groups', `${table}.id`, 'regions_groups.region_id')
        .where('regions_groups.group_id', '=', groupId);
    },
  },
};

export const buildGroupsListQuery = (options: Partial<QueryBuilderOptions<Group>>) =>
  buildRootQuery({
    info: options.info!,
    context: options.context!,
    table: 'groups_view',
    connections,
    orderBy: 'name',
    ...options,
  });
