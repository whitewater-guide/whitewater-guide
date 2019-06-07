import { Region, Section, User } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const PREMIUM_DIALOG_QUERY = gql`
  query premiumDialog($regionId: ID!, $sectionId: ID) {
    region(id: $regionId) {
      id
      hasPremiumAccess
    }
    section(id: $sectionId) {
      id
      description
    }
    me {
      id
      verified
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

export interface Vars {
  regionId?: string;
  sectionId?: string;
}

export interface Result {
  region: Pick<Region, 'id' | 'hasPremiumAccess'> | null;
  section: Pick<Section, 'id' | 'description'> | null;
  me: Pick<User, 'purchasedRegions' | 'purchasedGroups' | 'verified'> | null;
}
