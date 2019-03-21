import gql from 'graphql-tag';

export const APOLLO_ERROR_MUTATION = gql`
  mutation setApolloError($error: JSON) {
    setApolloError(error: $error) @client
  }
`;
