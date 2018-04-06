import { QueryBuilder } from 'knex';
import { baseResolver } from '../../../apollo';
import { buildGroupsListQuery } from '../queryBuilder';

interface Vars {
  regionId?: string;
}

const groups = baseResolver.createResolver(
  async (root, args: Vars, context, info) => {
    const { regionId } = args;
    const query = buildGroupsListQuery({ info, context });
    if (regionId) {
      query.whereExists(function(this: QueryBuilder) {
        this.select('*').from('regions_groups')
          .where('regions_groups.region_id', regionId)
          .whereRaw('regions_groups.group_id = groups_view.id');
      });
    }
    return query;
  },
);

export default groups;
