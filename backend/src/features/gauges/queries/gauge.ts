import { GraphQLResolveInfo } from 'graphql';
import { baseResolver, Context, NodeQuery } from '../../../apollo';
import { buildQuery } from '../queryBuilder';

const gauge = baseResolver.createResolver(
  (root, args: NodeQuery, context: Context, info: GraphQLResolveInfo) =>
    buildQuery({ info, context, ...args }).first(),
);

export default gauge;
