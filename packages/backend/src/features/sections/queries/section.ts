import { NodeQuery, TopLevelResolver } from '@apollo';

const section: TopLevelResolver<NodeQuery> = async (_, { id }, { models }) => {
  const result = await models.sections.getById(id);
  if (result && result.hidden) {
    await models.sections.assertEditorPermissions(id);
  }
  return result;
};

export default section;
