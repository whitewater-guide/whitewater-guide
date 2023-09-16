import type { QueryResolvers } from '../../../apollo/index';

const tags: QueryResolvers['tags'] = (_, __, { dataSources }, info) =>
  dataSources.tags.getMany(info);

export default tags;
