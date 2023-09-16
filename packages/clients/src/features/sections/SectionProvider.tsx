import type { QueryResult } from '@apollo/client';
import type { FC, PropsWithChildren } from 'react';
import React, { memo, useContext } from 'react';
import type { Overwrite, Required } from 'utility-types';

import type {
  SectionDetailsQuery,
  SectionDetailsQueryVariables,
} from './sectionDetails.generated';
import { useSectionDetailsQuery } from './sectionDetails.generated';

export type SectionProviderSection = NonNullable<
  SectionDetailsQuery['section']
>;

export const SectionContext = React.createContext<
  QueryResult<SectionDetailsQuery, SectionDetailsQueryVariables>
>({} as any);

interface Props {
  sectionId: string;
  thumbSize?: number;
}

export const SectionProvider: FC<PropsWithChildren<Props>> = memo((props) => {
  const { sectionId, thumbSize, children } = props;
  const result = useSectionDetailsQuery({
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { sectionId, withMedia: !!thumbSize, thumbSize },
    // This serves 2 purposes
    // 1. Render section details screen faster because we have partial section from list
    // 2. Return section from persisted cache even if section from user's cache has some missing fields (because it's from previous app version)
    returnPartialData: true,
  });

  return (
    <SectionContext.Provider value={result}>{children}</SectionContext.Provider>
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
