import { PurchaseInput } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const ACTIVATE_PROMO_MUTATION = gql`
  mutation activatePromo($purchase: PurchaseInput!) {
    addPurchase(purchase: $purchase)
  }
`;

export interface Vars {
  purchase: PurchaseInput;
}

export interface Result {
  addPurchase: boolean;
}
