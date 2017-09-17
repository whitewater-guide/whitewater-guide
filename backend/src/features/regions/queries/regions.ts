import { baseResolver } from '../../../apollo';
import db from '../../../db';
import { isAdmin } from '../../users';
import { getColumns } from '../columns';

const sources = baseResolver.createResolver(
  (root, args, context, info) => {
    const { user } = context;
    const columns = getColumns(info, context);
    const query = db().table('regions_view').select(columns).orderBy('name');
    if (!isAdmin(user)) {
      query.where({ hidden: false });
    }
    return query;
  },
);

export default sources;
