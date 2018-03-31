import gql from 'graphql-tag';

export const REGION_NAME = gql`
  query regionName($id: ID!) {
    region(id: $id) {
      id
      name
    }
  }
`;
