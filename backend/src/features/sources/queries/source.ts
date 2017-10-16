import { isAdminResolver } from '../../../apollo';
import db from '../../../db';
import { buildQuery } from '../queryBuilder';

interface SourceQuery {
  id: string;
  language?: string;
}

const source = isAdminResolver.createResolver(
  (root, args: SourceQuery, context, info) => buildQuery({ info, context, knex: db(), ...args }).first(),
);

export default source;
