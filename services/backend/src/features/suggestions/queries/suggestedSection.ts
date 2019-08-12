import { isAuthenticatedResolver, TopLevelResolver } from '@apollo';
import { SectionInput, SuggestedSection } from '@whitewater-guide/commons';

interface Vars {
  id: string;
}

const suggestedSection: TopLevelResolver<Vars> = async (
  _,
  { id },
  { dataSources },
) => {
  const result: SuggestedSection<
    SectionInput
  > = await dataSources.suggestedSections.getById(id);
  await dataSources.users.assertEditorPermissions({
    regionId: result.region.id,
  });
  return result;
};

export default isAuthenticatedResolver(suggestedSection);
