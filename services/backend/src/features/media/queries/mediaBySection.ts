import { TopLevelResolver } from '@apollo';

interface Vars {
  sectionId: string;
}

const mediaBySection: TopLevelResolver<Vars> = (
  _,
  { sectionId },
  { dataSources },
  info,
) => dataSources.media.getMany(info, { sectionId });

export default mediaBySection;
