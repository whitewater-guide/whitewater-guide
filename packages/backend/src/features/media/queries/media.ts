import { QueryResolvers } from '~/apollo';

const media: QueryResolvers['media'] = (_, { id }, { dataSources }) =>
  dataSources.media.getById(id);

export default media;
