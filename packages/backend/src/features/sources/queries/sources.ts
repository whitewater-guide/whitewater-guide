import { baseResolver, ListQuery } from '../../../apollo';
import { buildSourcesListQuery } from '../queryBuilder';

const sources = baseResolver.createResolver(
  (root, args: ListQuery, context, info) =>
    buildSourcesListQuery({ info, context, ...args }),
);

export default sources;
