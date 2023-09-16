import type { SectionResolvers } from '../../../apollo/index';

const mediaResolver: SectionResolvers['media'] = (
  { id },
  { page },
  { dataSources },
  info,
) => dataSources.media.getMany(info, { page, sectionId: id });

export default mediaResolver;
