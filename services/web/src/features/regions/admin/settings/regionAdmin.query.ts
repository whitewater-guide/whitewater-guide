import { Region, UploadLink } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

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

    uploadLink {
      postURL
      formData
      key
    }
  }
`;

export interface Result {
  settings: Region;
  uploadLink: UploadLink;
}
