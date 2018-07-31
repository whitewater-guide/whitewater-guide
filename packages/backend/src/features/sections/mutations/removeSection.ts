import { baseResolver, TopLevelResolver } from '@apollo';
import db from '@db';

interface Vars {
  id: string;
}

const resolver: TopLevelResolver<Vars> = async (root, { id }, { user, dataSources }) => {
  await dataSources.sections.assertEditorPermissions(id);
  const result = await db().table('sections').del().where({ id }).returning('id');
  return (result && result.length) ? result[0] : null;
};

const removeSection = baseResolver.createResolver(
  resolver,
);

export default removeSection;
