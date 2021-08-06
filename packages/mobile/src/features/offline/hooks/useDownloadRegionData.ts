import {
  RegionDetailsDocument,
  RegionDetailsQuery,
  RegionDetailsQueryVariables,
} from '@whitewater-guide/clients';
import { useCallback } from 'react';
import { useApolloClient } from 'react-apollo';

import theme from '~/theme';

export default (regionId: string | null) => {
  const apollo = useApolloClient();
  return useCallback(() => {
    if (!regionId) {
      throw new Error('region id not present');
    }
    return apollo.query<RegionDetailsQuery, RegionDetailsQueryVariables>({
      query: RegionDetailsDocument,
      variables: { regionId, bannerWidth: theme.screenWidthPx },
      fetchPolicy: 'network-only',
      errorPolicy: 'none',
    });
  }, [apollo, regionId]);
};
