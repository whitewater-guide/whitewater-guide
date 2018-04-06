import gql from 'graphql-tag';

export const UPSERT_GROUP = gql`
  mutation upsertGroup($group: GroupInput!) {
    upsertGroup(group: $group) {
      id
      name
    }
  }
`;
