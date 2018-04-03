import gql from 'graphql-tag';

const REGION_ADMIN_SETTINGS_QUERY = gql`
  query regionAdminSettings($regionId: ID) {
    settings: region(id: $regionId) {
      id
      hidden
      premium
    }
  }
`;

export default REGION_ADMIN_SETTINGS_QUERY;
