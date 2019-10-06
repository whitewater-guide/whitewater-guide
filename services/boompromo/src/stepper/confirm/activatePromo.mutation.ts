import { PurchaseInput, Region } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const ACTIVATE_PROMO_MUTATION = gql`
  mutation activatePromo($purchase: PurchaseInput!) {
    savePurchase(purchase: $purchase) {
      regions {
        id
        sku
        hasPremiumAccess
      }
    }
  }
`;

export interface Vars {
  purchase: PurchaseInput;
}

export interface Result {
  addPurchase: Array<Pick<Region, 'id' | 'sku' | 'hasPremiumAccess'>>;
}
