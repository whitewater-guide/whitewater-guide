import gql from 'graphql-tag';

export const ADD_EDITOR_MUTATION = gql`
  mutation addEditor($regionId: ID!, $userId: ID!) {
    addEditor(regionId: $regionId, userId: $userId)
  }
`;

export interface MVars {
  regionId: string;
  userId: string;
}
