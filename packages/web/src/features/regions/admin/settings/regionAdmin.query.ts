import gql from 'graphql-tag';

const REGION_ADMIN_SETTINGS_QUERY = gql`
  query regionAdminSettings($regionId: ID) {
    settings: region(id: $regionId) {
      id
      hidden
      premium
      sku
    }

    regionMediaForm(regionId: $regionId) {
      upload {
        postURL
        formData
        key
      }
    }
  }
`;

export default REGION_ADMIN_SETTINGS_QUERY;
