import { baseResolver, TopLevelResolver } from '@apollo';
import db from '@db';
import checkEditorPermissions from '../checkEditorPermissions';

interface Vars {
  id: string;
}

const resolver: TopLevelResolver<Vars> = async (root, { id }, { user }) => {
  await checkEditorPermissions(user, id);
  return db().table('sections').del().where({ id }).returning('id');
};

const removeSection = baseResolver.createResolver(
  resolver,
);

export default removeSection;
