import { RiverResolvers } from '~/apollo';

const sectionsResolver: RiverResolvers['sections'] = async (
  { id },
  { page },
  { dataSources },
  info,
) => {
  const sections = await dataSources.sections.getMany(info, {
    page,
    filter: { riverId: id },
  });
  return sections;
};

export default sectionsResolver;
