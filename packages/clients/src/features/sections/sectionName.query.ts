import gql from 'graphql-tag';

export const SECTION_NAME = gql`
  query sectionName($id: ID!) {
    section(id: $id) {
      id
      name
      river {
        id
        name
      }
    }
  }
`;
