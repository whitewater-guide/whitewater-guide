import { User } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const MY_PURCHASES_QUERY = gql`
  query myPurchases {
    me {
      id
      purchasedRegions {
        id
        name
      }
      purchasedGroups {
        id
        name
      }
    }
  }
`;

export interface Result {
  me: Pick<User, 'id' | 'purchasedRegions' | 'purchasedGroups'> | null;
}
