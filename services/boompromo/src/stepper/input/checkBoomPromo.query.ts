import { BoomPromoInfo } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const CHECK_BOOM_PROMO_QUERY = gql`
  query checkBoomPromo($code: String!) {
    checkBoomPromo(code: $code) {
      id
      code
      groupName
      groupSku
      redeemed
    }
  }
`;

export interface Vars {
  code: string;
}

export interface Result {
  checkBoomPromo: BoomPromoInfo | null;
}
