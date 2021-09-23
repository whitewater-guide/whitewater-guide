import { RegionResolvers } from '~/apollo';

const sectionsResolver: RegionResolvers['sections'] = async (
  { id },
  { page, filter, updatedAfter },
  { dataSources },
  info,
) => {
  const sections = await dataSources.sections.getMany(info, {
    page,
    filter: { ...filter, regionId: id },
    updatedAfter,
  });
  return sections;
};

export default sectionsResolver;
