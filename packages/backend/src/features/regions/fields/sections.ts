import { RegionResolvers } from '~/apollo';

const sectionsResolver: RegionResolvers['sections'] = async (
  { id },
  { page, filter },
  { dataSources },
  info,
) => {
  const { updatedAfter } = filter ?? {};
  const sections = await dataSources.sections.getMany(info, {
    page,
    filter: { regionId: id, updatedAfter },
  });
  return sections;
};

export default sectionsResolver;
