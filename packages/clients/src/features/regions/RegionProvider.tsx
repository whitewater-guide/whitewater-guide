import { FetchPolicy } from 'apollo-client';
import React, { useContext } from 'react';
import { QueryResult } from 'react-apollo';

import {
  RegionDetailsQuery,
  RegionDetailsQueryVariables,
  useRegionDetailsQuery,
} from './regionDetails.generated';

type RegionContext = QueryResult<
  RegionDetailsQuery,
  RegionDetailsQueryVariables
>;

const RegionCtx = React.createContext<RegionContext>({} as any);

type FunctionalChildren = (data: RegionContext) => React.ReactNode;

interface Props {
  regionId: string;
  bannerWidth?: number;
  fetchPolicy?: FetchPolicy;
  children?: FunctionalChildren | React.ReactNode;
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
    <RegionCtx.Provider value={queryResult}>
      {typeof children === 'function'
        ? (children as FunctionalChildren)(queryResult)
        : React.Children.only(children)}
    </RegionCtx.Provider>
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
