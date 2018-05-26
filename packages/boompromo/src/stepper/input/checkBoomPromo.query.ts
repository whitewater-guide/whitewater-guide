import gql from 'graphql-tag';
import { BoomPromoInfo } from '../../ww-commons';

export const CHECK_BOOM_PROMO_QUERY = gql`
  query checkBoomPromo($code: String!) {
    checkBoomPromo(code: $code) {
      id
      code
      groupName
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
