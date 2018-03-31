import gql from 'graphql-tag';

const UPSERT_RIVER = gql`
  mutation upsertRiver($river: RiverInput!){
    upsertRiver(river: $river){
      id
      name
      altNames
      region {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export default UPSERT_RIVER;
