import { baseResolver, ListQuery } from '../../../apollo';
import { buildRiversListQuery } from '../queryBuilder';

const rivers = baseResolver.createResolver(
  (root, args: ListQuery, context, info) => buildRiversListQuery({ info, context, ...args }),
);

export default rivers;
