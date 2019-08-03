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
      @connection(key: "history", suggestions: ["filter"]) {
      nodes {
        id
        description
        copyright
        createdAt
        status
        section {
          id
          name
          river {
            id
            name
          }
          region {
            id
            name
          }
        }
        image
        thumb: image(width: 100, height: 100)
        resolution
      }
      count
    }
  }
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
