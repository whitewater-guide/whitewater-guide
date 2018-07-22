import gql from 'graphql-tag';
import { PurchaseInput } from '../../../ww-commons';

export const ADD_PURCHASE_MUTATION = gql`
  mutation addPurchase($info: PurchaseInput!) {
    addPurchase(purchase: $info)
  }
`;

export interface Vars {
  info: PurchaseInput;
}
