import gql from 'graphql-tag';

export const SOURCE_NAME = gql`
  query sourceName($id: ID!) {
    source(id: $id) {
      id
      name
    }
  }
`;
