import { baseResolver, ListQuery } from '../../../apollo';
import { isAdmin } from '../../../ww-commons';
import { buildRegionsListQuery } from '../queryBuilder';

const regions = baseResolver.createResolver(
  (root, args: ListQuery, context, info) => {
    const query = buildRegionsListQuery({ info, context, ...args });
    if (!isAdmin(context.user)) {
      query.where('regions_view.hidden', false);
    }
    return query;
  },
);

export default regions;
