import { isAdminResolver } from '../../../apollo';
import db from '../../../db';

const sources = isAdminResolver.createResolver(
  () => db().table('sources_view').select().orderBy('name'),
);

export default sources;
