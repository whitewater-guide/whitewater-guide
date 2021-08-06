import { QueryResolvers } from '~/apollo';

const mediaBySection: QueryResolvers['mediaBySection'] = (
  _,
  { sectionId },
  { dataSources },
  info,
) => dataSources.media.getMany(info, { sectionId });

export default mediaBySection;
