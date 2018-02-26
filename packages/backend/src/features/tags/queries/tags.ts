import { baseResolver } from '../../../apollo/enhancedResolvers';
import { buildTagsListQuery } from '../queryBuilder';

const tags = baseResolver.createResolver(
  (root, args, context, info) => buildTagsListQuery({ info, context, ...args }),
);

export default tags;
