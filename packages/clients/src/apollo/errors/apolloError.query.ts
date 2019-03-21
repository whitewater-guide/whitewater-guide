import gql from 'graphql-tag';

export const APOLLO_ERROR_QUERY = gql`
  {
    apolloError @client
  }
`;
