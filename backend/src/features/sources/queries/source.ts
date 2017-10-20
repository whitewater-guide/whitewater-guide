import { isAdminResolver, NodeQuery } from '../../../apollo';
import db from '../../../db';
import { buildQuery } from '../queryBuilder';

const source = isAdminResolver.createResolver(
  (root, args: NodeQuery, context, info) => {
    if (!args.id) {
      return null;
    }
    return buildQuery({ info, context, knex: db(), ...args }).first();
  },
);

export default source;
