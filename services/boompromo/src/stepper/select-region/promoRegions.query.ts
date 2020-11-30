import { Region } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const PROMO_REGIONS_QUERY = gql`
  query promoRegions {
    promoRegions {
      id
      name
      sku
    }
  }
`;

export interface Result {
  promoRegions: Region[];
}