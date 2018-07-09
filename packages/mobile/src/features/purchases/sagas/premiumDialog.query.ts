import gql from 'graphql-tag';
import { Region, Section, User } from '../../../ww-commons';

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
  me: Pick<User, 'purchasedRegions' | 'purchasedGroups'> | null;
}