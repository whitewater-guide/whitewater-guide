import { NamedNode, UserFilterOptions } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const FIND_USERS_QUERY = gql`
  query findUsers($filter: UserFilterOptions!) {
    users: findUsers(filter: $filter) {
      id
      name
    }
  }
`;

export interface QVars {
  filter: UserFilterOptions;
}

export interface QResult {
  users: NamedNode[];
}
