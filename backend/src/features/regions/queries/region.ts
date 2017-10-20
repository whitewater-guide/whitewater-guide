import { GraphQLResolveInfo } from 'graphql';
import { baseResolver, Context, ForbiddenError, NodeQuery } from '../../../apollo';
import { isAdmin } from '../../users';
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
    if (result && result.hidden && !isAdmin(user)) {
      throw new ForbiddenError({ message: 'This region is not yet available for public' });
    }
    return result;
  },
);

export default region;
