import { GraphQLResolveInfo } from 'graphql';
import { baseResolver, Context, NodeQuery } from '../../../apollo';
import { buildSectionQuery } from '../queryBuilder';

const section = baseResolver.createResolver(
  (root, args: NodeQuery, context: Context, info: GraphQLResolveInfo) => {
    if (!args.id) {
      return null;
    }
    const query = buildSectionQuery({ info, context, ...args });
    return query.first();
  },
);

export default section;
