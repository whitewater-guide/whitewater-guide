import { baseResolver, QueryWithLanguage } from '../../../apollo';
import { isAdmin } from '../../users';
import { buildRegionQuery } from '../queryBuilder';

const sources = baseResolver.createResolver(
  (root, args: QueryWithLanguage, context, info) => {
    const { user } = context;
    let query = buildRegionQuery({ info, context, ...args });
    if (!isAdmin(user)) {
      query = query.where('regions_view.hidden', false);
    }
    return query;
  },
);

export default sources;
