import { isAdminResolver, ListQuery } from '../../../apollo';
import { buildSourcesListQuery } from '../queryBuilder';

const sources = isAdminResolver.createResolver(
  (root, args: ListQuery, context, info) =>
    buildSourcesListQuery({ info, context, ...args }),
);

export default sources;
