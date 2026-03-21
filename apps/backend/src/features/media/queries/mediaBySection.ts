import type { QueryResolvers } from '../../../apollo/index';

const mediaBySection: QueryResolvers['mediaBySection'] = (
  _,
  { sectionId },
  { dataSources },
  info,
) => dataSources.media.getMany(info, { sectionId });

export default mediaBySection;
