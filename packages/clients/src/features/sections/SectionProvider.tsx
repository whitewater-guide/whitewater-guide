import { Section } from '@whitewater-guide/commons';
import { NetworkStatus } from 'apollo-client';
import React, { useContext } from 'react';
import { QueryHookOptions, useQuery } from 'react-apollo';
import { queryResultToNode, WithNode } from '../../apollo';
import {
  SECTION_DETAILS,
  SectionDetailsResult,
  SectionDetailsVars,
} from './sectionDetails.query';

export const SectionContext = React.createContext<WithNode<Section | null>>({
  node: null,
  loading: false,
  networkStatus: NetworkStatus.ready,
  refetch: () => Promise.resolve({} as any),
});

type FunctionalChildren = (region: WithNode<Section | null>) => React.ReactNode;

interface Props
  extends QueryHookOptions<SectionDetailsResult, SectionDetailsVars> {
  sectionId: string;
  children?: FunctionalChildren | React.ReactNode;
}

export const SectionProvider: React.FC<Props> = React.memo((props) => {
  const {
    sectionId,
    query = SECTION_DETAILS,
    fetchPolicy = 'cache-and-network',
    children,
    ...queryOptions
  } = props;
  const result = useQuery(query, {
    ...queryOptions,
    fetchPolicy,
    variables: { sectionId },
  });
  const { section } = queryResultToNode<Section, 'section'>(result, 'section');
  return (
    <SectionContext.Provider value={section}>
      {typeof children === 'function'
        ? (children as FunctionalChildren)(section)
        : React.Children.only(children)}
    </SectionContext.Provider>
  );
});

SectionProvider.displayName = 'SectionProvider';

export const useSection = () => useContext(SectionContext);
