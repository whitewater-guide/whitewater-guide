import type { QueryResolvers } from '../../../apollo/index';

const media: QueryResolvers['media'] = (_, { id }, { dataSources }) =>
  dataSources.media.getById(id);

export default media;
