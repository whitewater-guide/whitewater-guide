import { GraphQLResolveInfo } from 'graphql';
import { baseResolver, Context, NodeQuery } from '../../../apollo';
import { buildSectionQuery } from '../queryBuilder';
import { SectionRaw } from '../types';

const section = baseResolver.createResolver(
  async (root, args: NodeQuery, context: Context, info: GraphQLResolveInfo) => {
    if (!args.id) {
      return null;
    }
    const query = buildSectionQuery({ info, context, ...args });
    const result: SectionRaw | null = await query.first();
    return result;
  },
);

export default section;
