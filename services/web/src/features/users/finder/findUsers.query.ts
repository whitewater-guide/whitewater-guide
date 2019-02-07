import { NamedNode, UserFilter } from '../../../../../../packages/commons/dist';
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
