import { NamedNode, UserFilter } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const FIND_USERS_QUERY = gql`
  query findUsers($filter: UserFilter!) {
    users: findUsers(filter: $filter) {
      id
      name
    }
  }
`;

export interface QVars {
  filter: UserFilter;
}

export interface QResult {
  users: NamedNode[];
}
