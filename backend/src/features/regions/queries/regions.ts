import { baseResolver } from '../../../apollo';
import db from '../../../db';
import { isAdmin } from '../../users';
import { buildQuery } from '../queryBuilder';

const sources = baseResolver.createResolver(
  (root, args, context, info) => {
    const { user } = context;
    const { language = 'en' } = args;
    let query = buildQuery(db(), info, context);
    query = query.orderBy('regions_view.name').where({ language });
    if (!isAdmin(user)) {
      query = query.where({ hidden: false });
    }
    return query;
  },
);

export default sources;
