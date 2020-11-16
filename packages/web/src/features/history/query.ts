import {
  Connection,
  Page,
  SectionEditLogEntry,
  SectionsEditLogFilter,
} from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const SECTONS_EDIT_HISTORY_QUERY = gql`
  query sectionsEditLog($filter: SectionsEditLogFilter, $page: Page) {
    history: sectionsEditLog(filter: $filter, page: $page)
      @connection(key: "history", filter: ["filter"]) {
      nodes {
        id
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
        editor {
          id
          name
        }
        action
        diff
        createdAt
      }
      count
    }
  }
`;

export interface QVars {
  filter?: SectionsEditLogFilter;
  page?: Page;
}

export interface QResult {
  history: Connection<SectionEditLogEntry>;
}
