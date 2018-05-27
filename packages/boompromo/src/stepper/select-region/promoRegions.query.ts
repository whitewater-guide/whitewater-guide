import gql from 'graphql-tag';
import { Region } from '../../ww-commons';

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
