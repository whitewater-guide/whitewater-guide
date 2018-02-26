import { GraphQLResolveInfo } from 'graphql';
import { baseResolver, Context, NodeQuery } from '../../../apollo';
import { buildRiverQuery } from '../queryBuilder';

const river = baseResolver.createResolver(
  (root, args: NodeQuery, context: Context, info: GraphQLResolveInfo) => {
    if (!args.id) {
      return null;
    }
    return buildRiverQuery({ info, context, ...args }).first();
  },
);

export default river;
