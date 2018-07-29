import { NodeQuery, TopLevelResolver } from '@apollo';

const media: TopLevelResolver<NodeQuery> = (_, { id }, { models }) =>
  models.media.getById(id);

export default media;
