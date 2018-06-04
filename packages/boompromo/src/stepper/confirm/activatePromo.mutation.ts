import gql from 'graphql-tag';
import { PurchaseInput } from '../../ww-commons';

export const ACTIVATE_PROMO_MUTATION = gql`
  mutation activatePromo($purchase: PurchaseInput!) {
    addPurchase(purchase: $purchase)
  }
`;

export interface Vars {
  purchase: PurchaseInput;
}
