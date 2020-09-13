import { SuggestionFragments } from '@whitewater-guide/clients';
import {
  Connection,
  Page,
  Suggestion,
  SuggestionsFilter,
} from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const LIST_SUGGESTIONS_QUERY = gql`
  query sectionsEditLog($filter: SuggestionsFilter, $page: Page) {
    suggestions(filter: $filter, page: $page)
    @connection(key: "suggestions", suggestions: ["filter"]) {
      nodes {
        ...SuggestionCore
        createdAt
        createdBy {
          id
          name
        }
        status
        thumb: image(width: 100, height: 100)
      }
      count
    }
  }
  ${SuggestionFragments.Core}
`;

export interface QVars {
  filter?: SuggestionsFilter;
  page?: Page;
}

export interface ListedSuggestion extends Suggestion {
  thumb: string;
}

export interface QResult {
  suggestions: Required<Connection<ListedSuggestion>>;
}
