import { listResolvers } from '@apollo';
import Fields from './fields';
import Mutation from './mutations';
import Query from './queries';

export const suggestionsResolvers = {
  Suggestion: Fields,
  Query,
  Mutation,
  SuggestionsList: listResolvers,
};
