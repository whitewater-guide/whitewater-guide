import { GraphQLResolveInfo } from 'graphql';
import { baseResolver, Context, NodeQuery } from '../../../apollo';
import checkEditorPermissions from '../checkEditorPermissions';
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
    if (result && result.hidden) {
      await checkEditorPermissions(user, result.id);
    }
    return result;
  },
);

export default region;
