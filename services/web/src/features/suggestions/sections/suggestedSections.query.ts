import {
  Connection,
  Page,
  Section,
  SectionsFilter,
} from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const SUGGESTED_SECTIONS_QUERY = gql`
  query suggestedSections($filter: SectionsFilter, $page: Page) {
    sections(filter: $filter, page: $page)
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
      }
      count
    }
  }
`;

export interface QVars {
  filter?: SectionsFilter;
  page?: Page;
}

export interface QResult {
  sections: Required<Connection<Section>>;
}
