import gql from 'graphql-tag';

export const LIST_GROUPS = gql`
  query listGroups($regionId: ID) {
    groups(regionId: $regionId) {
      nodes {
        id
        name
        sku
        regions {
          nodes {
            id
            name
          }
        }
      }
      count
    }
  }
`;
