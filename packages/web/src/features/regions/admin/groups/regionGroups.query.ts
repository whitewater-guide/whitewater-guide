import gql from 'graphql-tag';

const REGION_EDITORS_QUERY = gql`
  query regionEditors($regionId: ID!) {
    editors: regionEditors(regionId: $regionId) {
      id
      name
    }
  }
`;

export default REGION_EDITORS_QUERY;
