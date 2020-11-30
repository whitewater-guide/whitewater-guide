import { Region } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const REGION_ADMIN_SETTINGS_QUERY = gql`
  query regionAdminSettings($regionId: ID) {
    settings: region(id: $regionId) {
      id
      hidden
      premium
      sku
      mapsSize
      coverImage {
        mobile
      }
    }
  }
`;

export interface QVars {
  regionId: string;
}

export interface QResult {
  settings: Pick<
    Region,
    'id' | 'hidden' | 'premium' | 'sku' | 'mapsSize' | 'coverImage'
  >;
}