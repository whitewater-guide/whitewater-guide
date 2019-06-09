import gql from 'graphql-tag';

export const ADD_EDITOR_MUTATION = gql`
  mutation addEditor($regionId: ID!, $userId: ID!) {
    addEditor(regionId: $regionId, userId: $userId)
  }
`;

export interface Vars {
  regionId: string;
  userId: string;
}

export type Result = boolean;
