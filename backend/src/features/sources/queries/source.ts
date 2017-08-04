import { isAdminResolver } from '../../../apollo';
import db from '../../../db';

interface SourceQuery {
  id: string;
}

const source = isAdminResolver.createResolver(
  (root, { id }: SourceQuery, context) => db().table('sources').select().where({ id }).first('*'),
);

export default source;
