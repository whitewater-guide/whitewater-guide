import { Region } from '@whitewater-guide/commons';
import { FetchPolicy, NetworkStatus } from 'apollo-client';
import { DocumentNode } from 'graphql';
import React, { useContext, useMemo } from 'react';
import { Query } from 'react-apollo';
import { queryResultToNode, WithNode } from '../../apollo';
import {
  REGION_DETAILS,
  RegionDetailsResult,
  RegionDetailsVars,
} from './regionDetails.query';
import { WithRegion } from './types';

export const RegionContext = React.createContext<WithNode<Region | null>>({
  node: null,
  loading: false,
  networkStatus: NetworkStatus.ready,
  refetch: () => Promise.resolve({} as any),
});

type FunctionalChildren = (region: WithNode<Region | null>) => React.ReactNode;

interface Props {
  regionId: string;
  bannerWidth?: number;
  query?: (bannerWidth?: number) => DocumentNode;
  fetchPolicy?: FetchPolicy;
  children?: FunctionalChildren | React.ReactNode;
}

export const RegionProvider: React.FC<Props> = React.memo((props) => {
  const {
    regionId,
    query = REGION_DETAILS,
    bannerWidth,
    fetchPolicy = 'cache-and-network',
    children,
  } = props;
  const QUERY = useMemo(() => query(bannerWidth), [query, bannerWidth]);
  const variables = useMemo(() => ({ regionId }), [regionId]);
  return (
    <Query<RegionDetailsResult, RegionDetailsVars>
      query={QUERY}
      variables={variables}
      fetchPolicy={fetchPolicy}
    >
      {(queryProps) => {
        const { region } = queryResultToNode<Region, 'region'>(
          queryProps,
          'region',
        );
        return (
          <RegionContext.Provider value={region}>
            {typeof children === 'function'
              ? (children as FunctionalChildren)(region)
              : React.Children.only(children)}
          </RegionContext.Provider>
        );
      }}
    </Query>
  );
});

RegionProvider.displayName = 'RegionProvider';

export const useRegion = () => useContext(RegionContext);

export function withRegion(
  Component: React.ComponentType<Props & WithRegion>,
): React.ComponentType<Props> {
  const Wrapper: React.FC<Props> = (props: Props) => {
    const region = useRegion();
    return <Component {...props} region={region} />;
  };
  Wrapper.displayName = 'withRegion';

  return Wrapper;
}
