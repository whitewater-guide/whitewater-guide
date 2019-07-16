import { Section } from '@whitewater-guide/commons';
import { FetchPolicy, NetworkStatus } from 'apollo-client';
import { DocumentNode } from 'graphql';
import React, { useContext, useMemo } from 'react';
import { Query } from 'react-apollo';
import { queryResultToNode, WithNode } from '../../apollo';
import {
  SECTION_DETAILS,
  SectionDetailsResult,
  SectionDetailsVars,
} from './sectionDetails.query';

export interface WithSection {
  section: WithNode<Section | null>;
}

export const SectionContext = React.createContext<WithNode<Section | null>>({
  node: null,
  loading: false,
  networkStatus: NetworkStatus.ready,
  refetch: () => Promise.resolve({} as any),
});

type FunctionalChildren = (region: WithNode<Section | null>) => React.ReactNode;

interface Props {
  sectionId: string;
  query?: DocumentNode;
  fetchPolicy?: FetchPolicy;
  children?: FunctionalChildren | React.ReactNode;
}

export const SectionProvider: React.FC<Props> = React.memo((props) => {
  const {
    sectionId,
    query = SECTION_DETAILS,
    fetchPolicy = 'cache-and-network',
    children,
  } = props;
  const variables = useMemo(() => ({ sectionId }), [sectionId]);
  return (
    <Query<SectionDetailsResult, SectionDetailsVars>
      query={query}
      variables={variables}
      fetchPolicy={fetchPolicy}
    >
      {(queryProps) => {
        const { section } = queryResultToNode<Section, 'section'>(
          queryProps,
          'section',
        );
        return (
          <SectionContext.Provider value={section}>
            {typeof children === 'function'
              ? (children as FunctionalChildren)(section)
              : React.Children.only(children)}
          </SectionContext.Provider>
        );
      }}
    </Query>
  );
});

SectionProvider.displayName = 'SectionProvider';

export const useSection = () => useContext(SectionContext);

export function withSection(
  Component: React.ComponentType<Props & WithSection>,
): React.ComponentType<Props> {
  const Wrapper: React.FC<Props> = (props: Props) => {
    const section = useSection();
    return <Component {...props} section={section} />;
  };
  Wrapper.displayName = 'withSection';

  return Wrapper;
}
