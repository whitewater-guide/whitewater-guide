import gql from 'graphql-tag';

const ADD_EDITOR_MUTATION = gql`
  mutation addEditor($regionId: ID!, $userId: ID!) {
    addEditor(regionId: $regionId, userId: $userId)
  }
`;

export default ADD_EDITOR_MUTATION;
