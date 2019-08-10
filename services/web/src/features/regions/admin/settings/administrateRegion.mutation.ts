import { RegionAdminSettings } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const ADMINISTRATE_REGION_MUTATION = gql`
  mutation administrateRegion($settings: RegionAdminSettings!) {
    administrateRegion(settings: $settings) {
      id
      hidden
      premium
      sku
      coverImage {
        mobile
      }
    }
  }
`;

export interface MVars {
  settings: RegionAdminSettings;
}
