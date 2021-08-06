import { SectionResolvers } from '~/apollo';

const mediaResolver: SectionResolvers['media'] = (
  { id },
  { page },
  { dataSources },
  info,
) => dataSources.media.getMany(info, { page, sectionId: id });

export default mediaResolver;
