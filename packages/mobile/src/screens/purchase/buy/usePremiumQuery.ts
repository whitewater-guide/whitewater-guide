import { Region, Section, User } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

import { IAPError, PremiumRegion } from '../../../features/purchases';

const PREMIUM_REGION_QUERY = gql`
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

interface Vars {
  regionId?: string;
  sectionId?: string;
}

interface Result {
  region: Pick<Region, 'id' | 'hasPremiumAccess'> | null;
  section: Pick<Section, 'id' | 'description'> | null;
  me: Pick<User, 'purchasedRegions' | 'purchasedGroups' | 'verified'> | null;
}

export default (region: PremiumRegion, sectionId?: string) => {
  const { data, loading, error, refetch } = useQuery<Result, Vars>(
    PREMIUM_REGION_QUERY,
    {
      fetchPolicy: 'network-only',
      variables: { regionId: region.id, sectionId },
    },
  );
  const hasPremiumAccess = !!(
    data &&
    data.region &&
    data.region.hasPremiumAccess
  );
  return {
    hasPremiumAccess,
    me: data && data.me,
    loading,
    error: error
      ? new IAPError(
          'screens:purchase.buy.errors.refreshPremium',
          JSON.stringify(error, null, 2),
        )
      : undefined,
    refetch,
  };
};
