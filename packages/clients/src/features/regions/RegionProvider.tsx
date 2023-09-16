import type { FetchPolicy, QueryResult } from '@apollo/client';
import React, { useContext } from 'react';

import type {
  RegionDetailsQuery,
  RegionDetailsQueryVariables,
} from './regionDetails.generated';
import { useRegionDetailsQuery } from './regionDetails.generated';

type RegionContext = QueryResult<
  RegionDetailsQuery,
  RegionDetailsQueryVariables
>;

const RegionCtx = React.createContext<RegionContext>({} as any);

interface Props {
  regionId?: string | null;
  bannerWidth?: number;
  fetchPolicy?: FetchPolicy;
  children?: any;
}

export const RegionProvider = React.memo<Props>((props) => {
  const {
    regionId,
    bannerWidth,
    fetchPolicy = 'cache-and-network',
    children,
  } = props;
  const queryResult = useRegionDetailsQuery({
    variables: { regionId, bannerWidth },
    fetchPolicy,
  });

  return (
    <RegionCtx.Provider value={queryResult}>{children}</RegionCtx.Provider>
  );
});

RegionProvider.displayName = 'RegionProvider';

export function useRegionQuery() {
  return useContext(RegionCtx);
}

export function useRegion() {
  const { data } = useContext(RegionCtx);
  return data?.region;
}
