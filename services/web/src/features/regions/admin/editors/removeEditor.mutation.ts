import gql from 'graphql-tag';

const REMOVE_EDITOR_MUTATION = gql`
  mutation removeEditor($regionId: ID!, $userId: ID!) {
    removeEditor(regionId: $regionId, userId: $userId)
  }
`;

export default REMOVE_EDITOR_MUTATION;
