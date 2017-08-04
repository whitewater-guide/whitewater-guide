import { isAdminResolver } from '../../../apollo/enhancedResolvers';
import db from '../../../db';

const sources = isAdminResolver.createResolver(
  () => db().table('sources').select().orderBy('name'),
);

export default sources;
