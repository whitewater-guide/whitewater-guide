import { isAuthenticatedResolver, NodeQuery, TopLevelResolver } from '@apollo';
import { SectionInput, SuggestedSection } from '@whitewater-guide/commons';
import get from 'lodash/get';

const suggestedSection: TopLevelResolver<NodeQuery> = async (
  _,
  { id },
  { dataSources },
) => {
  if (!id) {
    return null;
  }
  const result: SuggestedSection<
    SectionInput
  > = await dataSources.suggestedSections.getById(id);
  const regionId = get(result, 'region.id') || get(result, 'section.region.id');
  await dataSources.users.assertEditorPermissions({ regionId });
  return result;
};

export default isAuthenticatedResolver(suggestedSection);
