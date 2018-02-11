import gql from 'graphql-tag';

export const SECTION_NAME = gql`
  query sectionName($id: ID!, $language:String) {
    section(id: $id, language: $language) {
      id
      language
      name
      river {
        id
        language
        name
      }
    }
  }
`;
