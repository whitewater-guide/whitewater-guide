import React, { useContext } from 'react';
import { QueryResult } from 'react-apollo';

import {
  SectionDetailsQuery,
  SectionDetailsQueryVariables,
  useSectionDetailsQuery,
} from './sectionDetails.generated';

export type SectionProviderSection = NonNullable<
  SectionDetailsQuery['section']
>;

export const SectionContext = React.createContext<
  QueryResult<SectionDetailsQuery, SectionDetailsQueryVariables>
>({} as any);

type FunctionalChildren = (
  result: QueryResult<SectionDetailsQuery, SectionDetailsQueryVariables>,
) => React.ReactNode;

interface Props {
  sectionId: string;
  thumbSize?: number;
  children?: FunctionalChildren | React.ReactNode;
}

export const SectionProvider: React.FC<Props> = React.memo((props) => {
  const { sectionId, thumbSize, children } = props;
  const result = useSectionDetailsQuery({
    fetchPolicy: 'cache-and-network',
    variables: { sectionId, withMedia: !!thumbSize, thumbSize },
  });
  return (
    <SectionContext.Provider value={result}>
      {typeof children === 'function'
        ? (children as FunctionalChildren)(result)
        : React.Children.only(children)}
    </SectionContext.Provider>
  );
});

SectionProvider.displayName = 'SectionProvider';

export const useSectionQuery = () => useContext(SectionContext);
export const useSection = () => {
  const { data } = useContext(SectionContext);
  return data?.section;
};
