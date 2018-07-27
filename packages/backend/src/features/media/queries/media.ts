import { baseResolver, Context, NodeQuery } from '@apollo';
import { GraphQLResolveInfo } from 'graphql';
import { buildMediaQuery } from '../queryBuilder';

const media = baseResolver.createResolver(
  (root, args: NodeQuery, context: Context, info: GraphQLResolveInfo) => {
    if (!args.id) {
      return null;
    }
    return buildMediaQuery({ info, context, ...args }).first();
  },
);

export default media;
