import React, { useContext } from 'react';
import { QueryResult } from 'react-apollo';
import { Overwrite, Required } from 'utility-types';

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
    // This serves 2 purposes
    // 1. Render section details screen faster because we have partial section from list
    // 2. Return section from persisted cache even if section from user's cache has some missing fields (because it's from previous app version)
    returnPartialData: true,
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

/**
 * This is partial section details
 * When working with section it's safer to assume that all the fields are optional.
 * The reason for this is that we want to 'returnPartialData' - and as a result we may return
 * section from persisted cache from older app version, and this version might have less fields
 */
export type SafeSectionDetails = Required<
  Partial<SectionProviderSection>,
  'id'
>;

export function useSectionQuery(): QueryResult<
  Overwrite<SectionDetailsQuery, { section?: SafeSectionDetails | null }>,
  SectionDetailsQueryVariables
> {
  return useContext(SectionContext);
}

export function useSection(): SafeSectionDetails | null | undefined {
  const { data } = useContext(SectionContext);
  return data?.section;
}
