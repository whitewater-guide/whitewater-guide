import { QueryBuilder } from 'knex';
import { baseResolver, Context, ListQuery } from '../../../apollo';
import db from '../../../db';
import { buildRegionsListQuery } from '../queryBuilder';

const regions = baseResolver.createResolver(
  (root, args: ListQuery, context: Context, info) => {
    const { user } = context;
    const query = buildRegionsListQuery({ info, context, ...args });
    // Add editable field
    if (!user) {
      query.where('regions_view.hidden', false);
    } else if (!user.admin) {

      // Add 'editable' column as subquery
      const editableQ = db().select('region_id').from('regions_editors')
        .where('regions_editors.user_id', '=', user.id)
        .whereRaw('regions_editors.region_id = regions_view.id');

      query.select(db().raw(`(SELECT EXISTS (${editableQ.toString()})) as editable`));

      query.where(function(this: QueryBuilder) {
        this.where('regions_view.hidden', false)
          .orWhereExists(editableQ);
      });
    }
    return query;
  },
);

export default regions;
