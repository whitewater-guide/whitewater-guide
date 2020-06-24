import { listResolvers } from '~/apollo';
import Media from './fields';
import Mutation from './mutations';
import Query from './queries';

export const mediaResolvers = {
  Media,
  MediaList: listResolvers,
  Query,
  Mutation,
};
