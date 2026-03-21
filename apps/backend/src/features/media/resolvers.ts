import { listResolvers } from '../../apollo/index';
import Media from './fields/index';
import Mutation from './mutations/index';
import Query from './queries/index';

export const mediaResolvers = {
  Media,
  MediaList: listResolvers,
  Query,
  Mutation,
};
