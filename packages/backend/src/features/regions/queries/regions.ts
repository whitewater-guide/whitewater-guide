import { QueryBuilder } from 'knex';
import { baseResolver, Context, ListQuery } from '../../../apollo';
import { buildRegionsListQuery } from '../queryBuilder';

const regions = baseResolver.createResolver(
  (root, args: ListQuery, context: Context, info) => {
    const { user } = context;
    const query = buildRegionsListQuery({ info, context, ...args });
    if (!user) {
      query.where('regions_view.hidden', false);
    } else if (!user.admin) {
      query.where(function(this: QueryBuilder) {
        this.where('regions_view.hidden', false)
          .orWhereExists(function(this: QueryBuilder) {
            this.select('region_id').from('regions_editors')
              .where('regions_editors.user_id', '=', user.id)
              .whereRaw('regions_editors.region_id = regions_view.id');
          });
      });
    }
    return query;
  },
);

export default regions;
