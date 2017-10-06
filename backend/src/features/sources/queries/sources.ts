import { isAdminResolver } from '../../../apollo';
import db from '../../../db';

interface SourcesQuery {
  language?: string;
}

const sources = isAdminResolver.createResolver(
  (root, { language = 'en' }: SourcesQuery) =>
    db().table('sources_view').select().where({ language }).orderBy('name'),
);

export default sources;
