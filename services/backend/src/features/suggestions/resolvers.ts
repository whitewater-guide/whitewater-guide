import { listResolvers } from '@apollo';
import fields from './fields';
import Mutation from './mutations';
import Query from './queries';

export const suggestionsResolvers = {
  ...fields,
  Query,
  Mutation,
  SuggestionsList: listResolvers,
  SuggestedSectionsList: listResolvers,
};
