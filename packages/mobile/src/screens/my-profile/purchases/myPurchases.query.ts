import gql from 'graphql-tag';
import { User } from '../../../ww-commons/features/users';

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
