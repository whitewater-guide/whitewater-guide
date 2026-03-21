import { listResolvers } from '../../apollo/index';
import fields from './fields/index';
import Mutation from './mutations/index';
import Query from './queries/index';

export const suggestionsResolvers = {
  ...fields,
  Query,
  Mutation,
  SuggestionsList: listResolvers,
};
