import { NodeQuery, TopLevelResolver } from '@apollo';

const section: TopLevelResolver<NodeQuery> = async (_, { id }, { dataSources }) => {
  const result = await dataSources.sections.getById(id);
  if (result && result.hidden) {
    await dataSources.sections.assertEditorPermissions(id);
  }
  return result;
};

export default section;
