import { GraphQLResolveInfo } from 'graphql';
import { baseResolver, Context, ForbiddenError } from '../../../apollo';
import db from '../../../db';
import { isAdmin } from '../../users';
import { getColumns } from '../columns';
import { RegionRaw } from '../types';

interface RegionQuery {
  id: string;
  language?: string;
}

const region = baseResolver.createResolver(
  async (root, { id, language = 'en' }: RegionQuery, context: Context, info: GraphQLResolveInfo) => {
    const { user } = context;
    const columns = getColumns(info, context);
    const result: RegionRaw | null = await db().select(columns).from('regions_view')
      .where({ id, language }).first();
    if (result && result.hidden && !isAdmin(user)) {
      throw new ForbiddenError({ message: 'This region is not yet available for public' });
    }
    return result;
  },
);

export default region;
