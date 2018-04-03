import { GraphQLResolveInfo } from 'graphql';
import { baseResolver, Context, NodeQuery } from '../../../apollo';
import { buildRegionQuery } from '../queryBuilder';
import { RegionRaw } from '../types';

const region = baseResolver.createResolver(
  async (root, args: NodeQuery, context: Context, info: GraphQLResolveInfo) => {
    if (!args.id) {
      return null;
    }
    const { user } = context;
    const query = buildRegionQuery({ info, context, ...args });
    const result: RegionRaw | null = await query.first();
    if (result && result.hidden && !(user && user.admin)) {
      return null;
    }
    return result;
  },
);

export default region;
