import gql from 'graphql-tag';
import { Region, UploadLink } from '../../../../ww-commons';

export const REGION_ADMIN_SETTINGS_QUERY = gql`
  query regionAdminSettings($regionId: ID) {
    settings: region(id: $regionId) {
      id
      hidden
      premium
      sku
      coverImage {
        mobile
      }
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

export interface Result {
  settings: Region;
  regionMediaForm: {
    upload: UploadLink;
  };
}
