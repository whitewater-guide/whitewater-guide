import { QueryResolvers } from '~/apollo';

const tags: QueryResolvers['tags'] = (_, __, { dataSources }, info) =>
  dataSources.tags.getMany(info);

export default tags;
