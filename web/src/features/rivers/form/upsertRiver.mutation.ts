import gql from 'graphql-tag';

const UPSERT_RIVER = gql`
  mutation upsertRiver($river: RiverInput!, $language: String){
    upsertRiver(river: $river, language: $language){
      id
      language
      name
      altNames
      region {
        id
        language
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export default UPSERT_RIVER;
