import { baseResolver, TopLevelResolver } from '@apollo';

const tags: TopLevelResolver = (_, __, { models }, info) =>
  models.tags.getMany(info);

export default baseResolver.createResolver(tags);
