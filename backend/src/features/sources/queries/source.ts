import { isAdminResolver } from '../../../apollo';
import db from '../../../db';

interface SourceQuery {
  id: string;
  language?: string;
}

const source = isAdminResolver.createResolver(
  (root, { id, language = 'en' }: SourceQuery, context) =>
    db().table('sources_view').select().where({ id, language }).first('*'),
);

export default source;
