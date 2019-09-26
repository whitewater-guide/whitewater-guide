import {
  Connection,
  Page,
  SuggestedSection,
  SuggestionsFilter,
} from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const SUGGESTED_SECTIONS_QUERY = gql`
  query suggestedSections($filter: SuggestionsFilter, $page: Page) {
    suggestedSections(filter: $filter, page: $page)
      @connection(key: "suggestedSections", suggestions: ["filter"]) {
      nodes {
        id
        createdAt
        createdBy {
          id
          name
        }
        region {
          id
          name
        }
        river {
          id
          name
        }
        name
        status
      }
      count
    }
  }
`;

export interface QVars {
  filter?: SuggestionsFilter;
  page?: Page;
}

export type ListedSuggestedSection = Omit<SuggestedSection, 'section'>;

export interface QResult {
  suggestedSections: Required<Connection<ListedSuggestedSection>>;
}
