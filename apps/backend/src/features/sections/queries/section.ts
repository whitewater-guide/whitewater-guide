import type { QueryResolvers } from '../../../apollo/index';

const section: QueryResolvers['section'] = async (
  _,
  { id },
  { dataSources },
) => {
  const result = await dataSources.sections.getById(id);
  if (result?.hidden) {
    await dataSources.users.assertEditorPermissions({ sectionId: id });
  }
  return result;
};

export default section;
