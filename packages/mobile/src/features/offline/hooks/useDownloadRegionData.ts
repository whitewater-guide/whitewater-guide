import {
  REGION_DETAILS,
  RegionDetailsResult,
  RegionDetailsVars,
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
    return apollo.query<RegionDetailsResult, RegionDetailsVars>({
      query: REGION_DETAILS(theme.screenWidthPx),
      variables: { regionId },
      fetchPolicy: 'network-only',
      errorPolicy: 'none',
    });
  }, [apollo, regionId]);
};
