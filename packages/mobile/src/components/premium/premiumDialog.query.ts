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
  }
`;

export interface Vars {
  regionId?: string;
  sectionId?: string;
}
