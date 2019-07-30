import gql from 'graphql-tag';

export const REMOVE_EDITOR_MUTATION = gql`
  mutation removeEditor($regionId: ID!, $userId: ID!) {
    removeEditor(regionId: $regionId, userId: $userId)
  }
`;

export interface MVars {
  regionId: string;
  userId: string;
}
