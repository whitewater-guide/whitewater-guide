import { TopLevelResolver } from '@apollo';

interface Vars {
  sectionId: string;
}

const mediaBySection: TopLevelResolver<Vars> = (_, { sectionId }, { models }, info) =>
  models.media.getMany(info, { sectionId });

export default mediaBySection;
