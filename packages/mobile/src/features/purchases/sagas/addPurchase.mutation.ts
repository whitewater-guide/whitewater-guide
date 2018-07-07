import gql from 'graphql-tag';

export const ADD_PURCHASE_MUTATION = gql`
  mutation addPurchase($info: PurchaseInput!) {
    addPurchase(purchase: $info)
  }
`;
