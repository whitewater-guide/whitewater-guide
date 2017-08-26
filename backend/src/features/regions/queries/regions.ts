import { baseResolver } from '../../../apollo';
import db from '../../../db';
import { getColumns } from '../columns';
import { isAdmin } from '../../users';

const sources = baseResolver.createResolver(
  (root, args, context, info) => {
    const { user } = context;
    // TODO: proper mapping betwwen column tyoes and graphql type fields
    const columns = getColumns(info, context);
    const query = db().table('regions').select('*').orderBy('name');
    if (!isAdmin(user)) {
      query.where({ hidden: false });
    }
    return query;
  },
);

export default sources;
