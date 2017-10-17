import { GraphQLResolveInfo } from 'graphql';
import { baseResolver, Context, NodeQuery } from '../../../apollo';
import { buildGaugeQuery } from '../queryBuilder';

const gauge = baseResolver.createResolver(
  (root, args: NodeQuery, context: Context, info: GraphQLResolveInfo) =>
    buildGaugeQuery({ info, context, ...args }).first(),
);

export default gauge;
