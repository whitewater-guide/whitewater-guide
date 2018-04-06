import gql from 'graphql-tag';

export const LIST_GROUPS = gql`
  query listGroups($regionId: ID) {
    groups(regionId: $regionId) {
      id
      name
      regions {
        nodes {
          id
          name
        }
      }
    }
  }
`;
