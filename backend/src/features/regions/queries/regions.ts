import { baseResolver } from '../../../apollo';
import db from '../../../db';
import { getColumns } from '../columns';
import { isAdmin } from '../../users/isAdmin';

const sources = baseResolver.createResolver(
  (root, args, context, info) => {
    const { user } = context;
    const columns = getColumns(info, context);
    const query = db().table('regions').select(columns).orderBy('name');
    if (!isAdmin(user)) {
      query.where({ hidden: false });
    }
    return query;
  },
);

export default sources;
