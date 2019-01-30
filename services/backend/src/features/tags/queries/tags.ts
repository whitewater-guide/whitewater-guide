import { TopLevelResolver } from '@apollo';

const tags: TopLevelResolver = (_, __, { dataSources }, info) =>
  dataSources.tags.getMany(info);

export default tags;
