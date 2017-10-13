import { isAdminResolver } from '../../../apollo';
import db from '../../../db';
import foldResult from '../foldResult';
import { buildQuery } from '../queryBuilder';

interface SourceQuery {
  id: string;
  language?: string;
}

const source = isAdminResolver.createResolver(
  async (root, { id, language }: SourceQuery, context, info) => {
    const query = buildQuery(db(), info, context, id, language);
    const result = await query.first();
    return foldResult(result);
  },
);

export default source;
