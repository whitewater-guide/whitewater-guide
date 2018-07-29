import { baseResolver, TopLevelResolver } from '@apollo';
import db from '@db';

interface Vars {
  id: string;
}

const resolver: TopLevelResolver<Vars> = async (root, { id }, { user, models }) => {
  await models.sections.assertEditorPermissions(id);
  return db().table('sections').del().where({ id }).returning('id');
};

const removeSection = baseResolver.createResolver(
  resolver,
);

export default removeSection;
