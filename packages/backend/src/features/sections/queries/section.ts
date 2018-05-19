import { GraphQLResolveInfo } from 'graphql';
import { baseResolver, Context, NodeQuery } from '../../../apollo';
import checkEditorPermissions from '../checkEditorPermissions';
import { buildSectionQuery } from '../queryBuilder';

const section = baseResolver.createResolver(
  async (root, args: NodeQuery, context: Context, info: GraphQLResolveInfo) => {
    if (!args.id) {
      return null;
    }
    const query = buildSectionQuery({ info, context, ...args });
    const result = await query.first();
    if (result && result.hidden) {
      await checkEditorPermissions(context.user, result.id);
    }
    return result;
  },
);

export default section;
