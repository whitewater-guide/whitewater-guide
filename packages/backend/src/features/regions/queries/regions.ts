import { baseResolver, ListQuery } from '../../../apollo';
import { buildRegionsListQuery } from '../queryBuilder';

const regions = baseResolver.createResolver(
  (root, args: ListQuery, context, info) => {
    const query = buildRegionsListQuery({ info, context, ...args });
    if (!(context.user && context.user.admin)) {
      query.where('regions_view.hidden', false);
    }
    return query;
  },
);

export default regions;
