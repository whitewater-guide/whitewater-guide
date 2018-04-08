import gql from 'graphql-tag';

const REGION_ADMIN_SETTINGS_QUERY = gql`
  query regionAdminSettings($regionId: ID) {
    settings: region(id: $regionId) {
      id
      hidden
      premium
      sku
    }
  }
`;

export default REGION_ADMIN_SETTINGS_QUERY;
